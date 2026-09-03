"""
AI Assistant Module — Rule-based Q&A over crime data.

This module provides a conversational interface for investigators to query
crime data using natural language questions. It parses user intent, filters
the database, and returns formatted natural-language answers.
"""

import os
import re
import pandas as pd


# -----------------------------------------------------------------------
# Known values for intent detection
# -----------------------------------------------------------------------

CRIME_TYPES = [
    'vehicle theft', 'burglary', 'chain snatching', 'assault', 'robbery',
    'drug possession', 'fraud', 'vandalism', 'cybercrime', 'theft'
]

SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical']


# -----------------------------------------------------------------------
# Query parsing
# -----------------------------------------------------------------------

def parse_query(question):
    """
    Parse a natural-language question and extract the user's intent and
    filter parameters.

    Args:
        question (str): The user's question in plain English.

    Returns:
        dict: Keys are 'intent' (str), 'crime_type' (str|None),
              'area' (str|None), 'severity' (str|None).
    """
    q = question.lower().strip()

    # --- Detect intent ---------------------------------------------------
    if any(kw in q for kw in ['how many', 'count', 'total', 'number of']):
        intent = 'count'
    elif any(kw in q for kw in ['similar', 'like', 'related', 'match']):
        intent = 'similar'
    elif any(kw in q for kw in ['trend', 'pattern', 'increase', 'decrease', 'over time']):
        intent = 'trend'
    elif any(kw in q for kw in ['hotspot', 'dangerous', 'unsafe', 'high crime']):
        intent = 'hotspot'
    elif any(kw in q for kw in ['recent', 'latest', 'last', 'newest']):
        intent = 'recent'
    elif any(kw in q for kw in ['summary', 'overview', 'report', 'statistics']):
        intent = 'summary'
    else:
        intent = 'general'

    # --- Extract crime type ----------------------------------------------
    crime_type = None
    for ct in CRIME_TYPES:
        if ct in q:
            crime_type = ct.title()
            break
    # Handle partial matches
    if crime_type is None:
        if 'theft' in q:
            crime_type = 'Vehicle Theft'
        elif 'rob' in q:
            crime_type = 'Robbery'
        elif 'assault' in q:
            crime_type = 'Assault'
        elif 'burgl' in q:
            crime_type = 'Burglary'
        elif 'fraud' in q:
            crime_type = 'Fraud'
        elif 'drug' in q:
            crime_type = 'Drug Possession'
        elif 'snatch' in q:
            crime_type = 'Chain Snatching'
        elif 'vandal' in q:
            crime_type = 'Vandalism'
        elif 'cyber' in q:
            crime_type = 'Cybercrime'

    # --- Extract area (look for capitalized words that aren't keywords) ---
    area = None
    # Common Bangalore areas used in our dataset
    known_areas = [
        'koramangala', 'indiranagar', 'mg road', 'jayanagar', 'electronic city',
        'whitefield', 'majestic', 'hsr layout', 'btm layout', 'marathahalli',
        'kr puram'
    ]
    for a in known_areas:
        if a in q:
            area = a.title()
            break

    # --- Extract severity ------------------------------------------------
    severity = None
    for s in SEVERITY_LEVELS:
        if s in q:
            severity = s.title()
            break

    return {
        'intent': intent,
        'crime_type': crime_type,
        'area': area,
        'severity': severity
    }


# -----------------------------------------------------------------------
# Answer generation
# -----------------------------------------------------------------------

def answer_query(question, cases_df):
    """
    Answer a natural-language question using the crime cases DataFrame.

    Args:
        question (str): The user's question.
        cases_df (pd.DataFrame): DataFrame of all cases.

    Returns:
        dict: Keys are 'answer' (str), 'data' (list), 'intent' (str).
    """
    parsed = parse_query(question)
    intent = parsed['intent']
    crime_type = parsed['crime_type']
    area = parsed['area']
    severity = parsed['severity']

    # Apply filters to the DataFrame
    filtered = cases_df.copy()
    filter_parts = []

    if crime_type:
        filtered = filtered[filtered['crime_type'].str.lower() == crime_type.lower()]
        filter_parts.append(f"crime type '{crime_type}'")
    if area:
        filtered = filtered[filtered['area'].str.lower() == area.lower()]
        filter_parts.append(f"area '{area}'")
    if severity:
        filtered = filtered[filtered['severity'].str.lower() == severity.lower()]
        filter_parts.append(f"severity '{severity}'")

    filter_desc = " with " + ", ".join(filter_parts) if filter_parts else ""

    # --- Handle each intent ----------------------------------------------
    if intent == 'count':
        count = len(filtered)
        answer = f"There are {count} case(s){filter_desc}."
        if count > 0 and crime_type:
            areas = filtered['area'].value_counts()
            top_areas = ", ".join([f"{a} ({c})" for a, c in areas.head(3).items()])
            answer += f" Top areas: {top_areas}."
        return {
            'answer': answer,
            'data': [{'total_count': count}],
            'intent': intent
        }

    elif intent == 'similar':
        # Try to use the NLP similarity module
        try:
            import sys
            sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
            from nlp.similarity import find_similar_cases
            results = find_similar_cases(question, cases_df, top_n=5)
            if results:
                summaries = [format_case_summary(r) for r in results]
                answer = f"Here are cases similar to your query:\n" + "\n".join(summaries)
            else:
                answer = "No similar cases found for your query."
            return {
                'answer': answer,
                'data': results if results else [],
                'intent': intent
            }
        except Exception:
            # Fallback: return filtered cases
            data = filtered.head(5).to_dict('records')
            answer = f"Found {len(filtered)} potentially related case(s){filter_desc}."
            return {'answer': answer, 'data': data, 'intent': intent}

    elif intent == 'trend':
        if filtered.empty:
            return {
                'answer': f"No cases found{filter_desc} to analyze trends.",
                'data': [],
                'intent': intent
            }
        try:
            temp = filtered.copy()
            temp['month'] = pd.to_datetime(temp['date']).dt.to_period('M').astype(str)
            monthly = temp.groupby('month').size().to_dict()
            months = sorted(monthly.keys())
            trend_data = {m: monthly[m] for m in months}

            if len(months) >= 2:
                first_val = monthly[months[0]]
                last_val = monthly[months[-1]]
                if last_val > first_val:
                    direction = "increasing"
                elif last_val < first_val:
                    direction = "decreasing"
                else:
                    direction = "stable"
            else:
                direction = "insufficient data"

            monthly_str = ", ".join([f"{m}: {c} cases" for m, c in trend_data.items()])
            answer = f"Crime trend{filter_desc} is {direction}. Monthly breakdown: {monthly_str}."
            return {
                'answer': answer,
                'data': [trend_data],
                'intent': intent
            }
        except Exception:
            return {
                'answer': "Unable to compute trends from the available data.",
                'data': [],
                'intent': intent
            }

    elif intent == 'hotspot':
        try:
            import sys
            sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
            from ml.hotspot import find_hotspots, get_hotspot_summary
            hotspots = find_hotspots(filtered)
            summary = get_hotspot_summary(hotspots)
            if hotspots:
                hotspot_lines = []
                for h in hotspots:
                    hotspot_lines.append(
                        f"  • {h['dominant_crime_type']} cluster near "
                        f"({h['center_lat']:.4f}, {h['center_lon']:.4f}) "
                        f"with {h['case_count']} cases"
                    )
                answer = (
                    f"Found {summary['total_hotspots']} crime hotspot(s){filter_desc} "
                    f"covering {summary['total_cases_in_hotspots']} cases:\n"
                    + "\n".join(hotspot_lines)
                )
            else:
                answer = f"No significant crime hotspots detected{filter_desc}."
            return {
                'answer': answer,
                'data': hotspots,
                'intent': intent
            }
        except Exception as e:
            return {
                'answer': f"Unable to compute hotspots: {str(e)}",
                'data': [],
                'intent': intent
            }

    elif intent == 'recent':
        recent = filtered.sort_values('date', ascending=False).head(5)
        if recent.empty:
            answer = f"No recent cases found{filter_desc}."
            data = []
        else:
            summaries = [format_case_summary(row.to_dict()) for _, row in recent.iterrows()]
            answer = f"Here are the {len(recent)} most recent case(s){filter_desc}:\n" + "\n".join(summaries)
            data = recent.to_dict('records')
        return {'answer': answer, 'data': data, 'intent': intent}

    elif intent == 'summary':
        total = len(filtered)
        if total == 0:
            return {
                'answer': f"No cases found{filter_desc}.",
                'data': [],
                'intent': intent
            }
        type_counts = filtered['crime_type'].value_counts().to_dict()
        status_counts = filtered['status'].value_counts().to_dict()
        severity_counts = filtered['severity'].value_counts().to_dict()
        area_counts = filtered['area'].value_counts().head(5).to_dict()

        type_str = ", ".join([f"{t}: {c}" for t, c in type_counts.items()])
        status_str = ", ".join([f"{s}: {c}" for s, c in status_counts.items()])
        sev_str = ", ".join([f"{s}: {c}" for s, c in severity_counts.items()])
        area_str = ", ".join([f"{a}: {c}" for a, c in area_counts.items()])

        answer = (
            f"Crime Summary{filter_desc}:\n"
            f"  Total cases: {total}\n"
            f"  By type: {type_str}\n"
            f"  By status: {status_str}\n"
            f"  By severity: {sev_str}\n"
            f"  Top areas: {area_str}"
        )
        return {
            'answer': answer,
            'data': [{
                'total': total,
                'by_type': type_counts,
                'by_status': status_counts,
                'by_severity': severity_counts,
                'top_areas': area_counts
            }],
            'intent': intent
        }

    else:  # general
        if filtered.empty:
            answer = f"No cases found{filter_desc}. Try rephrasing your question."
            data = []
        else:
            sample = filtered.head(5)
            summaries = [format_case_summary(row.to_dict()) for _, row in sample.iterrows()]
            answer = (
                f"Found {len(filtered)} case(s){filter_desc}. "
                f"Here are up to 5:\n" + "\n".join(summaries)
            )
            data = sample.to_dict('records')
        return {'answer': answer, 'data': data, 'intent': intent}


def format_case_summary(case_row):
    """
    Format a single case record into a human-readable one-line summary.

    Args:
        case_row (dict or pd.Series): A single case record.

    Returns:
        str: Formatted summary string.
    """
    case_id = case_row.get('case_id', '?')
    crime_type = case_row.get('crime_type', 'Unknown')
    area = case_row.get('area', 'Unknown')
    date = case_row.get('date', 'Unknown')
    severity = case_row.get('severity', 'Unknown')
    status = case_row.get('status', 'Unknown')

    return f"  Case #{case_id}: {crime_type} in {area} on {date} ({severity} severity, {status})"


# -----------------------------------------------------------------------
# Standalone demo
# -----------------------------------------------------------------------

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, '..', 'data', 'crime_data.csv')

    print(f"Loading crime data from: {data_path}")
    cases_df = pd.read_csv(data_path)
    print(f"Loaded {len(cases_df)} cases.\n")

    # Demo questions
    demo_questions = [
        "How many vehicle thefts are there?",
        "Show recent cases in Koramangala",
        "What are the crime trends?",
        "Give me a summary",
        "Which areas are dangerous?",
        "Find cases similar to motorcycle theft at night",
    ]

    for q in demo_questions:
        print(f"Q: {q}")
        result = answer_query(q, cases_df)
        print(f"A: {result['answer']}")
        print(f"   [Intent: {result['intent']}, Data items: {len(result['data'])}]")
        print()
