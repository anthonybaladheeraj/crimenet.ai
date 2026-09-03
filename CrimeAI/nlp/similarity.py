"""
similarity.py - Similar case finder using TF-IDF and Cosine Similarity.

This module provides functionality to index crime case descriptions using TF-IDF
(Term Frequency-Inverse Document Frequency) and perform similarity searches using
cosine similarity. It supports finding similar cases by reference case ID or by free text,
as well as batch extraction of related cases based on a similarity threshold.
"""

import os
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Global variables (module level) for caching the TF-IDF model and indexed vectors
_vectorizer = None
_tfidf_matrix = None
_case_ids = None


def build_index(cases_df):
    """
    Build and cache the TF-IDF vectorizer and representation matrix for cases.

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing at least 'case_id' and 'description' columns.

    Returns:
        bool: True on success.
    """
    global _vectorizer, _tfidf_matrix, _case_ids

    # Fill missing descriptions with empty strings to avoid vectorizer errors
    descriptions = cases_df['description'].fillna('').astype(str)

    # Initialize TF-IDF Vectorizer with standard english stop words and feature limit
    _vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    _tfidf_matrix = _vectorizer.fit_transform(descriptions)
    _case_ids = cases_df['case_id'].tolist()

    return True


def find_similar_cases(case_id_or_text, cases_df, top_n=5):
    """
    Find top N similar cases to a given case_id or a free text search query.

    Parameters:
        case_id_or_text (int or str): Case ID (int) to find similar cases to, or free text string.
        cases_df (pd.DataFrame): Full cases DataFrame containing case metadata.
        top_n (int): Number of similar cases to return (default: 5).

    Returns:
        list[dict]: List of dicts with:
            - case_id: ID of the matching case
            - similarity_score (float 0-1): Cosine similarity score
            - crime_type: Crime category/type
            - date: Date of the incident
            - area: Incident area/location
            - description: Truncated description (up to 100 characters)
    """
    global _vectorizer, _tfidf_matrix, _case_ids

    # Build index if not already built
    if _vectorizer is None or _tfidf_matrix is None or _case_ids is None:
        build_index(cases_df)

    if top_n <= 0:
        return []

    is_case_id_search = isinstance(case_id_or_text, (int, np.integer))

    if is_case_id_search:
        target_case_id = int(case_id_or_text)
        if target_case_id in _case_ids:
            case_idx = _case_ids.index(target_case_id)
        elif str(target_case_id) in [str(cid) for cid in _case_ids]:
            case_idx = [str(cid) for cid in _case_ids].index(str(target_case_id))
        else:
            raise ValueError(f"Case ID '{target_case_id}' was not found in the indexed cases.")

        # Retrieve TF-IDF vector of target case
        query_vector = _tfidf_matrix[case_idx]
    elif isinstance(case_id_or_text, str):
        # Transform free text query using fitted vectorizer
        query_vector = _vectorizer.transform([case_id_or_text])
        target_case_id = None
    else:
        raise TypeError(f"case_id_or_text must be an integer case_id or text string, got {type(case_id_or_text)}.")

    # Compute cosine similarity between query vector and all indexed cases
    similarity_scores = cosine_similarity(query_vector, _tfidf_matrix).flatten()

    # Sort indices by similarity descending
    sorted_indices = np.argsort(similarity_scores)[::-1]

    results = []
    for idx in sorted_indices:
        current_case_id = _case_ids[idx]

        # Exclude the query case itself if searching by case_id
        if is_case_id_search and current_case_id == target_case_id:
            continue

        # Look up case metadata in cases_df
        matching_rows = cases_df[cases_df['case_id'] == current_case_id]
        if matching_rows.empty:
            continue
        row = matching_rows.iloc[0]

        score = float(np.clip(similarity_scores[idx], 0.0, 1.0))
        raw_desc = str(row['description']) if 'description' in row and pd.notna(row['description']) else ''
        truncated_desc = raw_desc[:100]

        clean_case_id = int(current_case_id) if isinstance(current_case_id, (np.integer, int)) else current_case_id

        results.append({
            'case_id': clean_case_id,
            'similarity_score': score,
            'crime_type': str(row['crime_type']) if 'crime_type' in row and pd.notna(row['crime_type']) else '',
            'date': str(row['date']) if 'date' in row and pd.notna(row['date']) else '',
            'area': str(row['area']) if 'area' in row and pd.notna(row['area']) else '',
            'description': truncated_desc
        })

        if len(results) >= top_n:
            break

    return results


def find_related_cases_batch(cases_df, threshold=0.3):
    """
    Find related cases for all cases in the dataset using a cosine similarity threshold.

    Parameters:
        cases_df (pd.DataFrame): DataFrame containing case records with 'case_id' and 'description'.
        threshold (float): Similarity threshold (default: 0.3) for considering cases related.

    Returns:
        dict: Mapping of case_id -> list of related case_ids.
    """
    global _vectorizer, _tfidf_matrix, _case_ids

    # Build index if needed
    if _vectorizer is None or _tfidf_matrix is None or _case_ids is None:
        build_index(cases_df)

    # Compute pairwise cosine similarity matrix for all cases
    similarity_matrix = cosine_similarity(_tfidf_matrix, _tfidf_matrix)

    related_map = {}
    for i, cid in enumerate(_case_ids):
        clean_cid = int(cid) if isinstance(cid, (np.integer, int)) else cid
        scores = similarity_matrix[i]

        # Rank all cases by similarity descending, filtering out self and scores <= threshold
        sorted_indices = np.argsort(scores)[::-1]
        related_ids = [
            int(_case_ids[j]) if isinstance(_case_ids[j], (np.integer, int)) else _case_ids[j]
            for j in sorted_indices
            if j != i and scores[j] > threshold
        ]
        related_map[clean_cid] = related_ids

    return related_map


if __name__ == '__main__':
    # Locate crime_data.csv relative to this script or current working directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, '..', 'data', 'crime_data.csv')
    if not os.path.exists(data_path):
        data_path = os.path.join('..', 'data', 'crime_data.csv')

    print(f"Loading crime data from: {data_path}")
    cases_df = pd.read_csv(data_path)
    print(f"Loaded {len(cases_df)} cases successfully.\n")

    # 1. Build index
    print("Building TF-IDF index...")
    build_index(cases_df)
    print("Index built successfully.\n")

    # 2. Find similar cases to case_id 1
    print("--- Similar Cases to Case ID 1 ---")
    similar_to_1 = find_similar_cases(1, cases_df, top_n=5)
    for rank, case in enumerate(similar_to_1, start=1):
        print(f"{rank}. [Case {case['case_id']}] Similarity: {case['similarity_score']:.4f} | "
              f"Type: {case['crime_type']} | Area: {case['area']} | Date: {case['date']}")
        print(f"   Description: {case['description']}...\n")

    # 3. Search for free-text query 'motorcycle theft at night'
    search_query = 'motorcycle theft at night'
    print(f"--- Similar Cases for Query: '{search_query}' ---")
    similar_to_query = find_similar_cases(search_query, cases_df, top_n=5)
    for rank, case in enumerate(similar_to_query, start=1):
        print(f"{rank}. [Case {case['case_id']}] Similarity: {case['similarity_score']:.4f} | "
              f"Type: {case['crime_type']} | Area: {case['area']} | Date: {case['date']}")
        print(f"   Description: {case['description']}...\n")

    # 4. Batch related cases
    print("--- Batch Related Cases (Threshold > 0.3) ---")
    batch_relations = find_related_cases_batch(cases_df, threshold=0.3)
    cases_with_relations = {cid: rel for cid, rel in batch_relations.items() if len(rel) > 0}
    print(f"Found {len(cases_with_relations)} cases with related links:")
    for cid, related_ids in list(cases_with_relations.items())[:5]:
        print(f"  Case {cid} -> {related_ids}")
