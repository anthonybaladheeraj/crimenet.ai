"""
Anomaly Detection Module for CrimeAI
====================================
This module identifies unusual crime incidents using the Isolation Forest
unsupervised machine learning algorithm from scikit-learn.

Anomalous cases are flagged based on spatial, temporal, categorical,
and severity feature distributions.
"""

from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import LabelEncoder


def detect_anomalies(
    cases_df: pd.DataFrame, contamination: float = 0.1
) -> List[Dict[str, Any]]:
    """
    Detect anomalous crime incidents using an Isolation Forest model.

    Features used for anomaly detection:
      - hour: Extracted from 'time' (HH:MM format)
      - day_of_week: Extracted from 'date' (YYYY-MM-DD format, Monday=0 ... Sunday=6)
      - crime_type_encoded: Categorical encoding of 'crime_type'
      - area_encoded: Categorical encoding of 'area'
      - latitude: Numerical latitude coordinate
      - longitude: Numerical longitude coordinate
      - severity_numeric: Ordinal mapping of 'severity' (Low=1, Medium=2, High=3, Critical=4)

    Parameters:
        cases_df (pd.DataFrame): Input DataFrame containing crime incident records.
            Required columns: 'case_id', 'crime_type', 'date', 'time',
            'area', 'latitude', 'longitude', 'severity'.
        contamination (float): The proportion of outliers in the data set (default: 0.1).

    Returns:
        List[Dict[str, Any]]: List of dictionaries representing anomalous cases,
            sorted by 'anomaly_score' ascending (most anomalous first).
            Each dictionary contains:
              - 'case_id'
              - 'crime_type'
              - 'date'
              - 'time'
              - 'area'
              - 'anomaly_score' (from IsolationForest.decision_function)
    """
    # Return empty list if input DataFrame is empty
    if cases_df is None or cases_df.empty:
        return []

    # Work on a copy to avoid modifying the caller's original DataFrame
    df = cases_df.copy()

    # 1. Extract hour from 'time' column (parse HH:MM)
    # pd.to_datetime parses HH:MM strings and .dt.hour returns the 0-23 integer hour
    parsed_time = pd.to_datetime(df['time'].astype(str).str.strip(), format='%H:%M', errors='coerce')
    # Fallback to string splitting if any format mismatch occurs
    if parsed_time.isna().any():
        df['hour'] = df['time'].apply(
            lambda t: int(str(t).strip().split(':')[0]) if pd.notna(t) and ':' in str(t) else 0
        )
    else:
        df['hour'] = parsed_time.dt.hour

    # 2. Extract day_of_week from 'date' column (parse YYYY-MM-DD, use datetime weekday)
    # pd.to_datetime with .dt.weekday aligns with Python datetime.weekday() (0=Monday, 6=Sunday)
    parsed_date = pd.to_datetime(df['date'].astype(str).str.strip(), format='%Y-%m-%d', errors='coerce')
    df['day_of_week'] = parsed_date.dt.weekday.fillna(0).astype(int)

    # 3. Encode crime_type using LabelEncoder
    crime_encoder = LabelEncoder()
    df['crime_type_encoded'] = crime_encoder.fit_transform(df['crime_type'].astype(str))

    # 4. Encode area using LabelEncoder
    area_encoder = LabelEncoder()
    df['area_encoded'] = area_encoder.fit_transform(df['area'].astype(str))

    # 5. Encode severity as numeric: Low=1, Medium=2, High=3, Critical=4
    severity_mapping = {
        'Low': 1,
        'Medium': 2,
        'High': 3,
        'Critical': 4,
    }
    df['severity_numeric'] = (
        df['severity']
        .astype(str)
        .str.strip()
        .str.capitalize()
        .map(severity_mapping)
        .fillna(1)
        .astype(int)
    )

    # Ensure latitude and longitude are numeric floats
    df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce').fillna(0.0)
    df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce').fillna(0.0)

    # 6. Build features matrix:
    # [hour, day_of_week, crime_type_encoded, area_encoded, latitude, longitude, severity_numeric]
    feature_columns = [
        'hour',
        'day_of_week',
        'crime_type_encoded',
        'area_encoded',
        'latitude',
        'longitude',
        'severity_numeric',
    ]
    features_matrix = df[feature_columns].to_numpy(dtype=float)

    # 7. Fit IsolationForest and predict
    # IsolationForest predicts -1 for anomalies (outliers) and 1 for normal cases (inliers)
    iso_forest = IsolationForest(contamination=contamination, random_state=42)
    predictions = iso_forest.fit_predict(features_matrix)
    # decision_function returns anomaly scores: lower values indicate greater anomaly
    anomaly_scores = iso_forest.decision_function(features_matrix)

    df['is_anomaly'] = predictions == -1
    df['anomaly_score'] = anomaly_scores

    # Filter only anomalous records
    anomalous_df = df[df['is_anomaly']]

    # 8. Build output list of dicts for anomalous cases
    anomalies: List[Dict[str, Any]] = []
    for _, row in anomalous_df.iterrows():
        case_id = row['case_id']
        if isinstance(case_id, (np.integer,)):
            case_id = int(case_id)

        anomalies.append({
            'case_id': case_id,
            'crime_type': str(row['crime_type']),
            'date': str(row['date']),
            'time': str(row['time']),
            'area': str(row['area']),
            'anomaly_score': float(row['anomaly_score']),
        })

    # Sort by anomaly_score ascending (most anomalous first)
    anomalies.sort(key=lambda item: item['anomaly_score'])

    return anomalies


def get_anomaly_summary(
    anomalies: List[Dict[str, Any]], total_cases: int
) -> Dict[str, Any]:
    """
    Generate summary statistics for detected anomalies.

    Parameters:
        anomalies (List[Dict[str, Any]]): List of anomaly dictionaries from detect_anomalies.
        total_cases (int): Total number of cases evaluated.

    Returns:
        Dict[str, Any]: Summary dictionary with keys:
          - 'total_anomalies' (int): Total count of flagged anomalous cases.
          - 'percentage' (float): Percentage of total cases flagged as anomalies.
          - 'anomaly_crime_types' (dict): Frequency count of anomalies by crime type (crime_type -> count).
          - 'anomaly_areas' (dict): Frequency count of anomalies by area (area -> count).
    """
    total_anomalies = len(anomalies)
    percentage = (
        round((total_anomalies / total_cases) * 100.0, 2) if total_cases > 0 else 0.0
    )

    # Count frequencies by crime type and area
    crime_type_counts = Counter(item['crime_type'] for item in anomalies if 'crime_type' in item)
    area_counts = Counter(item['area'] for item in anomalies if 'area' in item)

    return {
        'total_anomalies': int(total_anomalies),
        'percentage': float(percentage),
        'anomaly_crime_types': dict(crime_type_counts),
        'anomaly_areas': dict(area_counts),
    }


if __name__ == '__main__':
    # Locate crime_data.csv relative to this script file
    script_dir = Path(__file__).resolve().parent
    data_file_path = script_dir.parent / 'data' / 'crime_data.csv'

    # Fallback to current working directory relative path if needed
    if not data_file_path.exists():
        data_file_path = Path('../data/crime_data.csv')

    print(f"Loading crime dataset from: {data_file_path}")
    cases_dataframe = pd.read_csv(data_file_path)
    print(f"Successfully loaded {len(cases_dataframe)} crime incidents.\n")

    # Detect anomalies with 10% contamination rate
    detected_anomalies = detect_anomalies(cases_dataframe, contamination=0.1)

    # Generate anomaly summary
    summary_data = get_anomaly_summary(detected_anomalies, total_cases=len(cases_dataframe))

    # Display flagged cases
    print(f"=== Flagged Anomalous Cases ({len(detected_anomalies)}) ===")
    for rank, case in enumerate(detected_anomalies, start=1):
        print(
            f"  {rank}. Case ID: {case['case_id']:<4} | "
            f"Type: {case['crime_type']:<16} | "
            f"Area: {case['area']:<14} | "
            f"Date: {case['date']} {case['time']} | "
            f"Score: {case['anomaly_score']:.4f}"
        )

    # Display summary
    print("\n=== Anomaly Summary ===")
    print(f"Total Cases Evaluated: {len(cases_dataframe)}")
    print(f"Total Anomalies Flagged: {summary_data['total_anomalies']}")
    print(f"Anomaly Percentage: {summary_data['percentage']}%")

    print("\nAnomalies by Crime Type:")
    for crime_name, count in summary_data['anomaly_crime_types'].items():
        print(f"  - {crime_name}: {count}")

    print("\nAnomalies by Area:")
    for area_name, count in summary_data['anomaly_areas'].items():
        print(f"  - {area_name}: {count}")
