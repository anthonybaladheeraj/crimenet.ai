"""
Crime Pattern Analysis Module

This module analyzes historical crime data to identify temporal patterns,
geographic hotspots, crime type distributions, severity levels, and
longitudinal trends.
"""

from collections import Counter
import os
import pandas as pd


def analyze_time_patterns(cases_df: pd.DataFrame) -> dict:
    """
    Analyze crime occurrences by time of day and hourly distribution.

    Categorizes incidents into four distinct time periods:
      - Morning: 06:00 - 11:59 (hours 6 to 11)
      - Afternoon: 12:00 - 16:59 (hours 12 to 16)
      - Evening: 17:00 - 20:59 (hours 17 to 20)
      - Night: 21:00 - 05:59 (hours 21 to 23 and 0 to 5)

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing a 'time' column with 'HH:MM' strings.

    Returns:
        dict: A dictionary containing:
            - 'by_period': dict mapping period name to incident count.
            - 'by_hour': dict mapping integer hour (0-23) to incident count.
            - 'peak_period': str representing the period with the highest number of incidents.
    """
    if cases_df.empty or 'time' not in cases_df.columns:
        return {
            'by_period': {'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0},
            'by_hour': {},
            'peak_period': ''
        }

    period_counts = {'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0}
    hour_counts = Counter()

    for time_val in cases_df['time'].dropna():
        try:
            # Parse hour from HH:MM string format
            time_str = str(time_val).strip()
            hour = int(time_str.split(':')[0])

            # Track hour counts
            hour_counts[hour] += 1

            # Categorize into periods
            if 6 <= hour < 12:
                period_counts['Morning'] += 1
            elif 12 <= hour < 17:
                period_counts['Afternoon'] += 1
            elif 17 <= hour < 21:
                period_counts['Evening'] += 1
            else:
                period_counts['Night'] += 1
        except (ValueError, IndexError):
            # Skip invalid time formats gracefully
            continue

    # Determine peak period (period with the maximum case count)
    peak_period = max(period_counts, key=period_counts.get) if any(period_counts.values()) else ''

    # Sort hourly counts by hour for clean output
    by_hour = dict(sorted(hour_counts.items()))

    return {
        'by_period': period_counts,
        'by_hour': by_hour,
        'peak_period': peak_period
    }


def analyze_area_patterns(cases_df: pd.DataFrame) -> dict:
    """
    Analyze geographic crime distribution and crime breakdown per area.

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing 'area' and 'crime_type' columns.

    Returns:
        dict: A dictionary containing:
            - 'by_area': dict mapping area name to total crime count.
            - 'area_crime_types': dict mapping area name to a dictionary of {crime_type: count}.
            - 'highest_crime_area': str representing the area with the highest number of incidents.
    """
    if cases_df.empty or 'area' not in cases_df.columns:
        return {
            'by_area': {},
            'area_crime_types': {},
            'highest_crime_area': ''
        }

    # Count total cases per area
    area_counts = Counter(cases_df['area'].dropna())
    by_area = dict(area_counts)

    # Count crime types for each area
    area_crime_types = {}
    if 'crime_type' in cases_df.columns:
        for area, group in cases_df.groupby('area'):
            area_crime_types[str(area)] = dict(Counter(group['crime_type'].dropna()))
    else:
        for area in by_area:
            area_crime_types[str(area)] = {}

    # Identify area with highest crime incidents
    highest_crime_area = max(by_area, key=by_area.get) if by_area else ''

    return {
        'by_area': by_area,
        'area_crime_types': area_crime_types,
        'highest_crime_area': highest_crime_area
    }


def analyze_crime_type_patterns(cases_df: pd.DataFrame) -> dict:
    """
    Analyze the distribution and proportions of different crime types.

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing a 'crime_type' column.

    Returns:
        dict: A dictionary containing:
            - 'counts': dict mapping crime type to incident count.
            - 'percentages': dict mapping crime type to percentage of total crimes (rounded to 2 decimal places).
            - 'most_common': str representing the most frequently occurring crime type.
    """
    if cases_df.empty or 'crime_type' not in cases_df.columns:
        return {
            'counts': {},
            'percentages': {},
            'most_common': ''
        }

    type_counts = Counter(cases_df['crime_type'].dropna())
    counts = dict(type_counts)
    total_crimes = sum(counts.values())

    percentages = {}
    if total_crimes > 0:
        for c_type, count in counts.items():
            percentages[c_type] = round((count / total_crimes) * 100, 2)

    most_common = max(counts, key=counts.get) if counts else ''

    return {
        'counts': counts,
        'percentages': percentages,
        'most_common': most_common
    }


def analyze_severity_distribution(cases_df: pd.DataFrame) -> dict:
    """
    Analyze the distribution of crime severity levels.

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing a 'severity' column.

    Returns:
        dict: A dictionary containing:
            - 'counts': dict mapping severity level to incident count.
            - 'percentages': dict mapping severity level to percentage of total crimes (rounded to 2 decimal places).
    """
    if cases_df.empty or 'severity' not in cases_df.columns:
        return {
            'counts': {},
            'percentages': {}
        }

    sev_counts = Counter(cases_df['severity'].dropna())
    counts = dict(sev_counts)
    total_crimes = sum(counts.values())

    percentages = {}
    if total_crimes > 0:
        for severity, count in counts.items():
            percentages[severity] = round((count / total_crimes) * 100, 2)

    return {
        'counts': counts,
        'percentages': percentages
    }


def analyze_trends(cases_df: pd.DataFrame) -> dict:
    """
    Analyze monthly crime trends and determine overall trajectory over time.

    Dates are formatted as YYYY-MM and sorted chronologically.
    The trend is determined by comparing the crime count in the last recorded
    month to the first recorded month:
      - 'increasing' if last month count > first month count
      - 'decreasing' if last month count < first month count
      - 'stable' if equal or if fewer than two months are recorded

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing a 'date' column.

    Returns:
        dict: A dictionary containing:
            - 'monthly_counts': dict mapping month string ('YYYY-MM') to crime count.
            - 'trend': str ('increasing', 'decreasing', or 'stable').
    """
    if cases_df.empty or 'date' not in cases_df.columns:
        return {
            'monthly_counts': {},
            'trend': 'stable'
        }

    # Parse dates safely to YYYY-MM format
    parsed_dates = pd.to_datetime(cases_df['date'], errors='coerce')
    valid_dates = parsed_dates.dropna()

    if valid_dates.empty:
        return {
            'monthly_counts': {},
            'trend': 'stable'
        }

    month_series = valid_dates.dt.strftime('%Y-%m')
    month_counter = Counter(month_series)
    monthly_counts = dict(sorted(month_counter.items()))

    # Compare last month to first month
    months_list = list(monthly_counts.keys())
    if len(months_list) < 2:
        trend = 'stable'
    else:
        first_month_count = monthly_counts[months_list[0]]
        last_month_count = monthly_counts[months_list[-1]]

        if last_month_count > first_month_count:
            trend = 'increasing'
        elif last_month_count < first_month_count:
            trend = 'decreasing'
        else:
            trend = 'stable'

    return {
        'monthly_counts': monthly_counts,
        'trend': trend
    }


def get_full_analysis(cases_df: pd.DataFrame) -> dict:
    """
    Execute comprehensive crime pattern analysis across all dimensions.

    Combines temporal, geographic, crime type, severity, and trend analyses.

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing case records.

    Returns:
        dict: Combined analysis containing:
            - 'time_patterns': result of analyze_time_patterns
            - 'area_patterns': result of analyze_area_patterns
            - 'crime_type_patterns': result of analyze_crime_type_patterns
            - 'severity_distribution': result of analyze_severity_distribution
            - 'trends': result of analyze_trends
    """
    return {
        'time_patterns': analyze_time_patterns(cases_df),
        'area_patterns': analyze_area_patterns(cases_df),
        'crime_type_patterns': analyze_crime_type_patterns(cases_df),
        'severity_distribution': analyze_severity_distribution(cases_df),
        'trends': analyze_trends(cases_df)
    }


if __name__ == '__main__':
    # Determine the path to ../data/crime_data.csv relative to this file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.normpath(os.path.join(base_dir, '..', 'data', 'crime_data.csv'))

    print("=" * 60)
    print("CRIME PATTERN ANALYSIS SYSTEM")
    print("=" * 60)
    print(f"Loading data from: {csv_path}")

    if not os.path.exists(csv_path):
        print(f"Error: Data file not found at {csv_path}")
    else:
        df = pd.read_csv(csv_path)
        print(f"Loaded {len(df)} crime records successfully.\n")

        analysis = get_full_analysis(df)

        # 1. Time Patterns
        print("-" * 50)
        print("1. TEMPORAL PATTERNS")
        print("-" * 50)
        time_data = analysis['time_patterns']
        print(f"Peak Period: {time_data['peak_period']}")
        print("Breakdown by Period:")
        for period, count in time_data['by_period'].items():
            print(f"  - {period:<12}: {count:>2} incidents")
        print("\nBreakdown by Hour:")
        for hour, count in time_data['by_hour'].items():
            print(f"  - Hour {hour:02d}:00   : {count:>2} incidents")

        # 2. Area Patterns
        print("\n" + "-" * 50)
        print("2. AREA PATTERNS")
        print("-" * 50)
        area_data = analysis['area_patterns']
        print(f"Highest Crime Area: {area_data['highest_crime_area']}")
        print("Incidents per Area:")
        for area, count in area_data['by_area'].items():
            print(f"  - {area:<16}: {count:>2} incidents")
        print("\nCrime Types by Area:")
        for area, types in area_data['area_crime_types'].items():
            type_summary = ", ".join(f"{t}: {c}" for t, c in types.items())
            print(f"  - {area:<16}: {type_summary}")

        # 3. Crime Type Patterns
        print("\n" + "-" * 50)
        print("3. CRIME TYPE PATTERNS")
        print("-" * 50)
        type_data = analysis['crime_type_patterns']
        print(f"Most Common Crime: {type_data['most_common']}")
        print("Distribution:")
        for c_type, count in type_data['counts'].items():
            pct = type_data['percentages'].get(c_type, 0.0)
            print(f"  - {c_type:<18}: {count:>2} ({pct:>5.1f}%)")

        # 4. Severity Distribution
        print("\n" + "-" * 50)
        print("4. SEVERITY DISTRIBUTION")
        print("-" * 50)
        sev_data = analysis['severity_distribution']
        print("Breakdown:")
        for sev, count in sev_data['counts'].items():
            pct = sev_data['percentages'].get(sev, 0.0)
            print(f"  - {sev:<12}: {count:>2} ({pct:>5.1f}%)")

        # 5. Longitudinal Trends
        print("\n" + "-" * 50)
        print("5. MONTHLY CRIME TRENDS")
        print("-" * 50)
        trend_data = analysis['trends']
        print(f"Overall Trend: {trend_data['trend'].upper()}")
        print("Monthly Case Counts:")
        for month, count in trend_data['monthly_counts'].items():
            print(f"  - {month}: {count:>2} cases")

        print("\n" + "=" * 60)
        print("ANALYSIS COMPLETE")
        print("=" * 60)
