"""
Crime Hotspot Detection Module
==============================
This module provides spatial clustering functionality using DBSCAN from scikit-learn
to identify crime hotspots and generate aggregate summary statistics.
"""

import os
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler


def find_hotspots(cases_df, eps=0.3, min_samples=3):
    """
    Detect crime hotspots using DBSCAN clustering on spatial coordinates.

    Parameters:
    -----------
    cases_df : pandas.DataFrame
        DataFrame containing crime incidents with at least the following columns:
        'case_id', 'crime_type', 'latitude', 'longitude'.
    eps : float, default=0.3
        The maximum distance between two samples for one to be considered
        as in the neighborhood of the other (after standard scaling).
    min_samples : int, default=3
        The number of samples in a neighborhood for a point to be considered
        as a core point.

    Returns:
    --------
    list of dict
        List of dictionaries representing detected hotspots. Each dictionary contains:
        - 'cluster_id' (int): Cluster identifier.
        - 'center_lat' (float): Mean latitude of points in the cluster.
        - 'center_lon' (float): Mean longitude of points in the cluster.
        - 'case_count' (int): Total number of cases in the cluster.
        - 'dominant_crime_type' (str): Most common crime_type in the cluster.
        - 'case_ids' (list): List of case_ids belonging to the cluster.
        Returns an empty list if no cases are provided or no clusters are found.
    """
    # Return empty list if input DataFrame is None or empty
    if cases_df is None or cases_df.empty:
        return []

    # Verify required columns exist
    required_columns = {'case_id', 'crime_type', 'latitude', 'longitude'}
    if not required_columns.issubset(cases_df.columns):
        missing = required_columns - set(cases_df.columns)
        raise ValueError(f"Missing required columns in cases_df: {missing}")

    # If the number of cases is less than min_samples, no clusters can be formed
    if len(cases_df) < min_samples:
        return []

    # Extract latitude and longitude coordinates
    coords = cases_df[['latitude', 'longitude']].values

    # Scale coordinates using StandardScaler
    scaler = StandardScaler()
    scaled_coords = scaler.fit_transform(coords)

    # Apply DBSCAN clustering
    dbscan = DBSCAN(eps=eps, min_samples=min_samples)
    cluster_labels = dbscan.fit_predict(scaled_coords)

    # Identify cluster labels excluding noise label (-1)
    unique_clusters = sorted([lbl for lbl in np.unique(cluster_labels) if lbl != -1])

    # If no clusters were found (all noise or empty), return empty list
    if not unique_clusters:
        return []

    hotspots = []
    for cluster_id in unique_clusters:
        # Filter rows belonging to the current cluster
        cluster_mask = (cluster_labels == cluster_id)
        cluster_data = cases_df[cluster_mask]

        # Calculate cluster center as the mean of original coordinates
        center_lat = float(cluster_data['latitude'].mean())
        center_lon = float(cluster_data['longitude'].mean())

        # Count total cases in this cluster
        case_count = int(len(cluster_data))

        # Find the most common (dominant) crime type in this cluster
        dominant_crime_type = str(cluster_data['crime_type'].mode().iloc[0])

        # Extract list of case IDs
        case_ids = cluster_data['case_id'].tolist()

        hotspot_info = {
            'cluster_id': int(cluster_id),
            'center_lat': center_lat,
            'center_lon': center_lon,
            'case_count': case_count,
            'dominant_crime_type': dominant_crime_type,
            'case_ids': case_ids
        }
        hotspots.append(hotspot_info)

    return hotspots


def get_hotspot_summary(hotspots):
    """
    Generate aggregate statistics and summary metrics from detected hotspots.

    Parameters:
    -----------
    hotspots : list of dict
        The list of hotspot dictionaries produced by find_hotspots.

    Returns:
    --------
    dict
        A summary dictionary containing:
        - 'total_hotspots' (int): Total count of detected hotspots.
        - 'total_cases_in_hotspots' (int): Sum of case_count across all hotspots.
        - 'most_active_hotspot' (dict or None): The hotspot dictionary with the
          highest case_count, or None if hotspots is empty.
        - 'crime_type_distribution' (dict): Mapping of dominant crime_type to
          frequency count across all hotspots.
    """
    if not hotspots:
        return {
            'total_hotspots': 0,
            'total_cases_in_hotspots': 0,
            'most_active_hotspot': None,
            'crime_type_distribution': {}
        }

    total_hotspots = len(hotspots)
    total_cases_in_hotspots = sum(h.get('case_count', 0) for h in hotspots)
    most_active_hotspot = max(hotspots, key=lambda h: h.get('case_count', 0))

    # Calculate distribution of crime types across all hotspots
    crime_type_distribution = {}
    for h in hotspots:
        crime_type = h.get('dominant_crime_type')
        if crime_type is not None:
            crime_type_distribution[crime_type] = crime_type_distribution.get(crime_type, 0) + 1

    return {
        'total_hotspots': total_hotspots,
        'total_cases_in_hotspots': total_cases_in_hotspots,
        'most_active_hotspot': most_active_hotspot,
        'crime_type_distribution': crime_type_distribution
    }


if __name__ == '__main__':
    # Determine the path to ../data/crime_data.csv relative to this file or current working directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, '..', 'data', 'crime_data.csv')
    if not os.path.exists(csv_path):
        csv_path = '../data/crime_data.csv'

    print(f"Loading crime data from: {csv_path}")
    cases_df = pd.read_csv(csv_path)

    # Detect hotspots
    hotspots = find_hotspots(cases_df)

    # Print each hotspot
    print(f"\nDetected Hotspots ({len(hotspots)}):")
    for hotspot in hotspots:
        print(hotspot)

    # Print the summary
    summary = get_hotspot_summary(hotspots)
    print("\nHotspot Summary:")
    print(summary)
