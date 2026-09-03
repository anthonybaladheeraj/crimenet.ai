"""
routes.py — API Route Handlers for CrimeAI Backend.

Defines all REST API endpoints as a Flask Blueprint. Each route handler:
  1. Accepts the HTTP request
  2. Queries the database
  3. Calls the appropriate ML/NLP function
  4. Returns JSON results
"""

import os
import sys
import hashlib

from flask import Blueprint, request, jsonify, session

# Ensure project root is importable
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from database.db import (
    get_all_cases, get_case, add_case, update_case, delete_case,
    search_cases, get_cases_as_dataframe,
    add_user, get_user, log_action
)

# Create the Blueprint
api_bp = Blueprint('api', __name__)


# =====================================================================
# CASE CRUD ENDPOINTS
# =====================================================================

@api_bp.route('/api/cases', methods=['GET'])
def list_cases():
    """
    List all cases with optional filters.

    Query params: crime_type, area, severity, status, date_from, date_to, limit
    """
    filters = {}
    for key in ['crime_type', 'area', 'severity', 'status', 'date_from', 'date_to', 'limit']:
        val = request.args.get(key)
        if val:
            filters[key] = val

    cases = get_all_cases(filters if filters else None)
    return jsonify({'status': 'ok', 'count': len(cases), 'cases': cases})


@api_bp.route('/api/cases/<int:case_id>', methods=['GET'])
def get_single_case(case_id):
    """Get a single case by ID."""
    case = get_case(case_id)
    if case:
        return jsonify({'status': 'ok', 'case': case})
    return jsonify({'status': 'error', 'message': 'Case not found'}), 404


@api_bp.route('/api/cases', methods=['POST'])
def create_case():
    """
    Add a new crime case.

    Expects JSON body with: crime_type, date, time, area, city,
    latitude, longitude, description, severity, status (optional).
    """
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON body provided'}), 400

    required = ['crime_type', 'date', 'time', 'area', 'city',
                'latitude', 'longitude', 'description', 'severity']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({
            'status': 'error',
            'message': f'Missing required fields: {", ".join(missing)}'
        }), 400

    case_id = add_case(
        crime_type=data['crime_type'],
        date=data['date'],
        time=data['time'],
        area=data['area'],
        city=data['city'],
        latitude=float(data['latitude']),
        longitude=float(data['longitude']),
        description=data['description'],
        severity=data['severity'],
        status=data.get('status', 'Open')
    )

    # Log the action if a user is in session
    user_id = session.get('user_id')
    if user_id:
        log_action(user_id, f'Created case #{case_id}')

    return jsonify({'status': 'ok', 'case_id': case_id, 'message': 'Case created successfully'}), 201


@api_bp.route('/api/cases/<int:case_id>', methods=['PUT'])
def update_single_case(case_id):
    """
    Update a case. Send only the fields you want to change.
    """
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON body provided'}), 400

    success = update_case(case_id, **data)
    if success:
        user_id = session.get('user_id')
        if user_id:
            log_action(user_id, f'Updated case #{case_id}')
        return jsonify({'status': 'ok', 'message': f'Case #{case_id} updated'})
    return jsonify({'status': 'error', 'message': 'Case not found or no valid fields'}), 404


@api_bp.route('/api/cases/<int:case_id>', methods=['DELETE'])
def delete_single_case(case_id):
    """Delete a case by ID."""
    success = delete_case(case_id)
    if success:
        user_id = session.get('user_id')
        if user_id:
            log_action(user_id, f'Deleted case #{case_id}')
        return jsonify({'status': 'ok', 'message': f'Case #{case_id} deleted'})
    return jsonify({'status': 'error', 'message': 'Case not found'}), 404


@api_bp.route('/api/cases/search', methods=['GET'])
def search():
    """
    Search cases by keyword across description, crime_type, and area.

    Query param: q (search query)
    """
    query = request.args.get('q', '')
    results = search_cases(query)
    return jsonify({'status': 'ok', 'count': len(results), 'cases': results})


# =====================================================================
# ML ENDPOINTS
# =====================================================================

@api_bp.route('/api/hotspots', methods=['GET'])
def get_hotspots():
    """
    Get crime hotspot clusters using DBSCAN.

    Query params: eps (float, default 0.3), min_samples (int, default 3)
    """
    from ml.hotspot import find_hotspots, get_hotspot_summary

    eps = float(request.args.get('eps', 0.3))
    min_samples = int(request.args.get('min_samples', 3))

    df = get_cases_as_dataframe()
    hotspots = find_hotspots(df, eps=eps, min_samples=min_samples)
    summary = get_hotspot_summary(hotspots)

    return jsonify({
        'status': 'ok',
        'hotspots': hotspots,
        'summary': summary
    })


@api_bp.route('/api/patterns', methods=['GET'])
def get_patterns():
    """Get full crime pattern analysis."""
    from ml.patterns import get_full_analysis

    df = get_cases_as_dataframe()
    analysis = get_full_analysis(df)
    return jsonify({'status': 'ok', 'analysis': analysis})


@api_bp.route('/api/anomalies', methods=['GET'])
def get_anomalies():
    """
    Get anomalous crime cases using Isolation Forest.

    Query param: contamination (float, default 0.1)
    """
    from ml.anomaly import detect_anomalies, get_anomaly_summary

    contamination = float(request.args.get('contamination', 0.1))

    df = get_cases_as_dataframe()
    anomalies = detect_anomalies(df, contamination=contamination)
    summary = get_anomaly_summary(anomalies, len(df))

    return jsonify({
        'status': 'ok',
        'anomalies': anomalies,
        'summary': summary
    })


# =====================================================================
# NLP ENDPOINTS
# =====================================================================

@api_bp.route('/api/similar/<int:case_id>', methods=['GET'])
def get_similar_cases(case_id):
    """
    Get cases similar to a given case using TF-IDF cosine similarity.

    Query param: top_n (int, default 5)
    """
    from nlp.similarity import find_similar_cases

    top_n = int(request.args.get('top_n', 5))

    df = get_cases_as_dataframe()

    # Verify the case exists
    case = get_case(case_id)
    if not case:
        return jsonify({'status': 'error', 'message': 'Case not found'}), 404

    similar = find_similar_cases(case_id, df, top_n=top_n)
    return jsonify({
        'status': 'ok',
        'case_id': case_id,
        'similar_cases': similar
    })


@api_bp.route('/api/similar/search', methods=['POST'])
def search_similar_text():
    """
    Find cases similar to a free-text description.

    Expects JSON body with: text (str), top_n (int, optional)
    """
    from nlp.similarity import find_similar_cases

    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'status': 'error', 'message': 'Provide a "text" field'}), 400

    top_n = int(data.get('top_n', 5))
    df = get_cases_as_dataframe()
    similar = find_similar_cases(data['text'], df, top_n=top_n)

    return jsonify({
        'status': 'ok',
        'query': data['text'],
        'similar_cases': similar
    })


@api_bp.route('/api/extract/<int:case_id>', methods=['GET'])
def extract_case_entities(case_id):
    """Extract entities (weapons, vehicles, etc.) from a case description."""
    from nlp.extraction import extract_entities

    case = get_case(case_id)
    if not case:
        return jsonify({'status': 'error', 'message': 'Case not found'}), 404

    entities = extract_entities(case.get('description', ''))
    return jsonify({
        'status': 'ok',
        'case_id': case_id,
        'entities': entities
    })


@api_bp.route('/api/extract/all', methods=['GET'])
def extract_all_entities():
    """Extract entities from all case descriptions and return common patterns."""
    from nlp.extraction import extract_from_multiple, get_common_patterns

    df = get_cases_as_dataframe()
    extractions = extract_from_multiple(df)

    # Convert Counter objects to dicts for JSON serialization
    patterns = get_common_patterns(extractions)
    patterns['common_weapons'] = dict(patterns['common_weapons'])
    patterns['common_vehicles'] = dict(patterns['common_vehicles'])

    # Convert case_id keys to strings for JSON
    extractions_serializable = {str(k): v for k, v in extractions.items()}

    return jsonify({
        'status': 'ok',
        'extractions': extractions_serializable,
        'patterns': patterns
    })


# =====================================================================
# AI ASSISTANT ENDPOINT
# =====================================================================

@api_bp.route('/api/assistant', methods=['POST'])
def ai_assistant():
    """
    AI Assistant endpoint — answer natural language questions about crime data.

    Expects JSON body with: question (str)
    """
    from nlp.assistant import answer_query

    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({'status': 'error', 'message': 'Provide a "question" field'}), 400

    df = get_cases_as_dataframe()
    result = answer_query(data['question'], df)

    # Log the query if user is in session
    user_id = session.get('user_id')
    if user_id:
        log_action(user_id, f'AI Assistant query: {data["question"][:100]}')

    return jsonify({
        'status': 'ok',
        'question': data['question'],
        'answer': result['answer'],
        'intent': result['intent'],
        'data': result['data']
    })


# =====================================================================
# AUTH ENDPOINTS
# =====================================================================

@api_bp.route('/auth/login', methods=['POST'])
def login():
    """
    User login.

    Expects JSON body with: username (str), password (str)
    """
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'status': 'error', 'message': 'Provide username and password'}), 400

    user = get_user(data['username'])
    if not user:
        return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401

    # Simple password hash check
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    if user['password_hash'] != password_hash:
        return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401

    session['user_id'] = user['user_id']
    session['username'] = user['username']
    session['role'] = user['role']

    log_action(user['user_id'], 'Logged in')

    return jsonify({
        'status': 'ok',
        'message': f'Welcome, {user["username"]}!',
        'user': {
            'user_id': user['user_id'],
            'username': user['username'],
            'role': user['role']
        }
    })


@api_bp.route('/auth/logout', methods=['POST'])
def logout():
    """User logout — clear session."""
    user_id = session.get('user_id')
    if user_id:
        log_action(user_id, 'Logged out')
    session.clear()
    return jsonify({'status': 'ok', 'message': 'Logged out successfully'})


@api_bp.route('/auth/register', methods=['POST'])
def register():
    """
    Register a new user.

    Expects JSON body with: username (str), password (str), role (str, optional)
    """
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'status': 'error', 'message': 'Provide username and password'}), 400

    # Check if user already exists
    existing = get_user(data['username'])
    if existing:
        return jsonify({'status': 'error', 'message': 'Username already exists'}), 409

    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    role = data.get('role', 'investigator')

    user_id = add_user(data['username'], password_hash, role)
    log_action(user_id, 'Account registered')

    return jsonify({
        'status': 'ok',
        'message': 'Registration successful',
        'user_id': user_id
    }), 201


# =====================================================================
# DASHBOARD SUMMARY ENDPOINT
# =====================================================================

@api_bp.route('/api/dashboard', methods=['GET'])
def dashboard_summary():
    """
    Combined dashboard endpoint — returns key stats, recent cases,
    and pattern highlights in a single call for the frontend dashboard.
    """
    from ml.patterns import get_full_analysis
    from ml.hotspot import find_hotspots, get_hotspot_summary

    df = get_cases_as_dataframe()
    total_cases = len(df)

    # Basic stats
    status_counts = df['status'].value_counts().to_dict() if not df.empty else {}
    severity_counts = df['severity'].value_counts().to_dict() if not df.empty else {}
    type_counts = df['crime_type'].value_counts().to_dict() if not df.empty else {}

    # Recent cases (last 5)
    recent = df.sort_values('date', ascending=False).head(5).to_dict('records') if not df.empty else []

    # Hotspot summary
    hotspots = find_hotspots(df)
    hotspot_summary = get_hotspot_summary(hotspots)

    # Pattern analysis
    patterns = get_full_analysis(df)

    return jsonify({
        'status': 'ok',
        'total_cases': total_cases,
        'status_counts': status_counts,
        'severity_counts': severity_counts,
        'type_counts': type_counts,
        'recent_cases': recent,
        'hotspot_summary': hotspot_summary,
        'hotspots': hotspots,
        'patterns': patterns
    })
