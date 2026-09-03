"""
Text Information Extraction Module for Crime Descriptions.

This module provides functions to extract structured entities (weapons,
vehicles, monetary amounts, time references, suspect information, and
evidence mentions) from unstructured crime incident descriptions using
regular expressions and keyword matching.
"""

import os
import re
from collections import Counter
from typing import Any, Dict, List
import pandas as pd


# ---------------------------------------------------------------------------
# Module-level Keyword Dictionaries & Patterns
# ---------------------------------------------------------------------------

WEAPON_KEYWORDS = [
    'knife', 'knives', 'gun', 'pistol', 'firearm', 'weapon',
    'sharp weapon', 'rod', 'bat', 'stick', 'blade', 'sword'
]

VEHICLE_KEYWORDS = [
    'car', 'motorcycle', 'bike', 'auto-rickshaw', 'autorickshaw',
    'truck', 'van', 'SUV', 'sedan', 'scooter', 'vehicle', 'auto'
]

TIME_PATTERNS = [
    r'\d{1,2}\s*(?:AM|PM|am|pm)',
    r'\d{1,2}:\d{2}',
    r'morning|afternoon|evening|night|midnight|dawn|dusk'
]

MONEY_PATTERN = (
    r'(?:Rs\.?|INR|rupees?)\s*[\d,]+\.?\d*|'
    r'[\d,]+\.?\d*\s*(?:lakhs?|crores?|rupees?)|'
    r'\d+\s*(?:Bitcoin|BTC)'
)

LOCATION_INDICATORS = [
    'near', 'outside', 'behind', 'in front of', 'beside',
    'opposite', 'at', 'from', 'towards'
]

SUSPECT_KEYWORDS = [
    'suspect', 'accused', 'attacker', 'assailant', 'thief',
    'perpetrator', 'men', 'man', 'male', 'female', 'woman', 'youth'
]

EVIDENCE_KEYWORDS = [
    'CCTV', 'footage', 'fingerprint', 'DNA', 'witness',
    'camera', 'evidence', 'forensic'
]


# ---------------------------------------------------------------------------
# Core Extraction Functions
# ---------------------------------------------------------------------------

def extract_entities(description: str) -> Dict[str, List[Any]]:
    """
    Extract structured entities from a single crime description text.

    Searches the text for:
      - Weapons mentioned (case-insensitive)
      - Vehicles mentioned (case-insensitive)
      - Monetary amounts (using regex patterns)
      - Time references (clock times, AM/PM, and time of day)
      - Suspect info sentences (sentences mentioning suspect keywords)
      - Evidence mentions (keywords like CCTV, witness, forensic, etc.)

    Args:
        description (str): Unstructured text describing a crime incident.

    Returns:
        dict: A dictionary containing:
            - 'weapons' (list): List of matched weapon keywords.
            - 'vehicles' (list): List of matched vehicle keywords.
            - 'monetary_amounts' (list): List of matched monetary strings.
            - 'time_references' (list): List of matched time expressions.
            - 'suspect_info' (list): Sentences from the text describing suspects.
            - 'evidence_mentions' (list): List of matched evidence keywords.
    """
    empty_result = {
        'weapons': [],
        'vehicles': [],
        'monetary_amounts': [],
        'time_references': [],
        'suspect_info': [],
        'evidence_mentions': []
    }

    if not description or not isinstance(description, str):
        return empty_result

    # 1. Search for weapons mentioned (case-insensitive)
    weapons = []
    for weapon in WEAPON_KEYWORDS:
        if weapon == 'knife':
            pattern = r'\bknife(?:s|point)?\b'
        elif weapon == 'sharp weapon':
            pattern = r'\bsharp\s+weapons?\b'
        else:
            pattern = rf'\b{re.escape(weapon)}(?:s|es)?\b'

        if re.search(pattern, description, re.IGNORECASE):
            if weapon not in weapons:
                weapons.append(weapon)

    # 2. Search for vehicles mentioned (case-insensitive)
    vehicles = []
    for vehicle in VEHICLE_KEYWORDS:
        pattern = rf'\b{re.escape(vehicle)}(?:s|es)?\b'
        if re.search(pattern, description, re.IGNORECASE):
            if vehicle not in vehicles:
                vehicles.append(vehicle)

    # 3. Search for monetary amounts
    monetary_amounts = []
    raw_monetary_matches = re.findall(MONEY_PATTERN, description, re.IGNORECASE)
    for match in raw_monetary_matches:
        cleaned_match = match.strip()
        if cleaned_match and cleaned_match not in monetary_amounts:
            monetary_amounts.append(cleaned_match)

    # 4. Search for time references
    time_references = []
    for pattern in TIME_PATTERNS:
        regex = rf'\b(?:{pattern})\b'
        for match in re.finditer(regex, description, re.IGNORECASE):
            # Avoid matching minute fragments like ':50 AM' in '12:50 AM' as standalone time
            if pattern == TIME_PATTERNS[0] and match.start() > 0 and description[match.start() - 1] == ':':
                continue
            val = match.group().strip()
            if val and val not in time_references:
                time_references.append(val)

    # 5. Extract sentences mentioning suspects
    # Split description into sentences using punctuation boundaries (. ! ?)
    raw_sentences = re.split(r'(?<=[.!?])\s+', description.strip())
    sentences = [s.strip() for s in raw_sentences if s.strip()]

    suspect_info = []
    for sentence in sentences:
        for kw in SUSPECT_KEYWORDS:
            if kw == 'thief':
                kw_pattern = r'\b(?:thief|thieves)\b'
            elif kw in ('man', 'men'):
                kw_pattern = r'\b(?:man|men)\b'
            elif kw in ('woman', 'women'):
                kw_pattern = r'\b(?:woman|women)\b'
            else:
                kw_pattern = rf'\b{re.escape(kw)}(?:s|es)?\b'

            if re.search(kw_pattern, sentence, re.IGNORECASE):
                if sentence not in suspect_info:
                    suspect_info.append(sentence)
                break

    # 6. Extract evidence mentions
    evidence_mentions = []
    for kw in EVIDENCE_KEYWORDS:
        pattern = rf'\b{re.escape(kw)}(?:s|es)?\b'
        if re.search(pattern, description, re.IGNORECASE):
            if kw not in evidence_mentions:
                evidence_mentions.append(kw)

    return {
        'weapons': weapons,
        'vehicles': vehicles,
        'monetary_amounts': monetary_amounts,
        'time_references': time_references,
        'suspect_info': suspect_info,
        'evidence_mentions': evidence_mentions
    }


def extract_from_multiple(cases_df: pd.DataFrame) -> Dict[Any, Dict[str, List[Any]]]:
    """
    Extract structured entities from multiple crime incident records in a DataFrame.

    Args:
        cases_df (pd.DataFrame): DataFrame containing 'case_id' and 'description' columns.

    Returns:
        dict: Mapping of case_id -> extraction result dictionary.
    """
    extractions = {}
    if cases_df is None or cases_df.empty:
        return extractions

    for _, row in cases_df.iterrows():
        case_id = row['case_id']
        description = str(row['description']) if pd.notna(row['description']) else ""
        extractions[case_id] = extract_entities(description)

    return extractions


def get_common_patterns(extractions: Dict[Any, Dict[str, List[Any]]]) -> Dict[str, Any]:
    """
    Aggregate and compute statistics on extracted entities across multiple cases.

    Args:
        extractions (dict): Dictionary mapping case_id -> extraction result dict
            (as produced by extract_from_multiple).

    Returns:
        dict: A dictionary containing:
            - 'common_weapons' (Counter): Frequency of each mentioned weapon.
            - 'common_vehicles' (Counter): Frequency of each mentioned vehicle.
            - 'total_monetary_cases' (int): Count of cases with monetary figures.
            - 'cases_with_evidence' (int): Count of cases with evidence mentions.
            - 'cases_with_suspects' (int): Count of cases with suspect information.
    """
    common_weapons = Counter()
    common_vehicles = Counter()
    total_monetary_cases = 0
    cases_with_evidence = 0
    cases_with_suspects = 0

    for extraction in extractions.values():
        if extraction.get('weapons'):
            common_weapons.update(extraction['weapons'])
        if extraction.get('vehicles'):
            common_vehicles.update(extraction['vehicles'])
        if extraction.get('monetary_amounts'):
            total_monetary_cases += 1
        if extraction.get('evidence_mentions'):
            cases_with_evidence += 1
        if extraction.get('suspect_info'):
            cases_with_suspects += 1

    return {
        'common_weapons': common_weapons,
        'common_vehicles': common_vehicles,
        'total_monetary_cases': total_monetary_cases,
        'cases_with_evidence': cases_with_evidence,
        'cases_with_suspects': cases_with_suspects
    }


# ---------------------------------------------------------------------------
# Main Execution Block
# ---------------------------------------------------------------------------

if __name__ == '__main__':
    # Resolve the path to crime_data.csv (supports execution from any working directory)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, '..', 'data', 'crime_data.csv')

    if not os.path.exists(data_path):
        data_path = '../data/crime_data.csv'

    print(f"Loading crime data from: {data_path}")
    cases_df = pd.read_csv(data_path)
    print(f"Loaded {len(cases_df)} cases successfully.\n")

    # Run extraction across all cases
    extractions = extract_from_multiple(cases_df)

    # Print a few example extractions
    print("=" * 65)
    print("EXAMPLE EXTRACTIONS (First 3 cases):")
    print("=" * 65)
    for case_id in list(extractions.keys())[:3]:
        print(f"\n--- Case ID: {case_id} ---")
        case_rows = cases_df.loc[cases_df['case_id'] == case_id, 'description']
        desc = case_rows.values[0] if not case_rows.empty else ""
        print(f"Description: {desc}")
        ext = extractions[case_id]
        print(f"  Weapons          : {ext['weapons']}")
        print(f"  Vehicles         : {ext['vehicles']}")
        print(f"  Monetary Amounts : {ext['monetary_amounts']}")
        print(f"  Time References  : {ext['time_references']}")
        print(f"  Suspect Info     : {ext['suspect_info']}")
        print(f"  Evidence Mentions: {ext['evidence_mentions']}")

    # Compute and display common patterns across the dataset
    patterns = get_common_patterns(extractions)
    print("\n" + "=" * 65)
    print("COMMON PATTERNS ACROSS ALL CASES:")
    print("=" * 65)
    print(f"Total Cases Analyzed      : {len(extractions)}")
    print(f"Cases with Monetary Values: {patterns['total_monetary_cases']}")
    print(f"Cases with Evidence       : {patterns['cases_with_evidence']}")
    print(f"Cases with Suspect Info   : {patterns['cases_with_suspects']}")

    print("\nMost Common Weapons:")
    if patterns['common_weapons']:
        for weapon, count in patterns['common_weapons'].most_common():
            print(f"  - {weapon}: {count}")
    else:
        print("  None detected.")

    print("\nMost Common Vehicles:")
    if patterns['common_vehicles']:
        for vehicle, count in patterns['common_vehicles'].most_common():
            print(f"  - {vehicle}: {count}")
    else:
        print("  None detected.")
