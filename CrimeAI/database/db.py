"""
Database module for Crime Analysis AI System.
Provides SQLite database connection, table initialization, CRUD operations for crime cases,
user management, audit logging, and pandas integration for ML/NLP pipelines.
"""

import os
import sqlite3
import pandas as pd

# Define paths for SQLite database and initial seed CSV dataset
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'crime_database.db')
DEFAULT_CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'crime_data.csv')


def get_db_connection(db_path=None):
    """
    Returns a sqlite3 connection with Row factory enabled.
    
    Args:
        db_path (str, optional): Path to the SQLite database file. Defaults to DB_PATH.
        
    Returns:
        sqlite3.Connection: Database connection with sqlite3.Row row_factory.
    """
    if db_path is None:
        db_path = DB_PATH
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(db_path=None, csv_path=None):
    """
    Creates all database tables if they do not exist.
    Also loads data from crime_data.csv if the cases table is empty.
    
    Args:
        db_path (str, optional): Database file path. Defaults to DB_PATH.
        csv_path (str, optional): CSV file path. Defaults to DEFAULT_CSV_PATH.
    """
    if db_path is None:
        db_path = DB_PATH
    if csv_path is None:
        csv_path = DEFAULT_CSV_PATH

    conn = get_db_connection(db_path)
    try:
        cursor = conn.cursor()

        # 1. cases table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cases (
                case_id INTEGER PRIMARY KEY AUTOINCREMENT,
                crime_type TEXT,
                date TEXT,
                time TEXT,
                area TEXT,
                city TEXT,
                latitude REAL,
                longitude REAL,
                description TEXT,
                severity TEXT,
                status TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 2. locations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS locations (
                location_id INTEGER PRIMARY KEY AUTOINCREMENT,
                area TEXT,
                city TEXT,
                latitude REAL,
                longitude REAL
            )
        """)

        # 3. evidence table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS evidence (
                evidence_id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id INTEGER REFERENCES cases(case_id),
                type TEXT,
                description TEXT,
                file_name TEXT
            )
        """)

        # 4. persons table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS persons (
                person_id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id INTEGER REFERENCES cases(case_id),
                role TEXT,
                alias TEXT
            )
        """)

        # 5. vehicles table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS vehicles (
                vehicle_id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id INTEGER REFERENCES cases(case_id),
                vehicle_type TEXT,
                model TEXT,
                color TEXT
            )
        """)

        # 6. users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT,
                role TEXT DEFAULT 'investigator'
            )
        """)

        # 7. audit_logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audit_logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()

        # Check if cases table is empty; if so, populate from CSV
        cursor.execute("SELECT COUNT(*) FROM cases")
        row_count = cursor.fetchone()[0]
        if row_count == 0:
            load_csv_data(csv_path, db_path=db_path)

    finally:
        conn.close()


def load_csv_data(csv_path=None, db_path=None):
    """
    Reads crime_data.csv with pandas and inserts records into the cases table.
    Also extracts and populates unique locations into the locations table.
    
    Args:
        csv_path (str, optional): Path to the CSV file. Defaults to DEFAULT_CSV_PATH.
        db_path (str, optional): Path to the database file. Defaults to DB_PATH.
        
    Returns:
        int: Number of cases inserted.
    """
    if csv_path is None:
        csv_path = DEFAULT_CSV_PATH
    if db_path is None:
        db_path = DB_PATH

    if not os.path.exists(csv_path):
        return 0

    df = pd.read_csv(csv_path)
    conn = get_db_connection(db_path)
    try:
        cursor = conn.cursor()
        inserted_count = 0

        for _, row in df.iterrows():
            case_id = int(row['case_id']) if 'case_id' in row and pd.notna(row['case_id']) else None
            crime_type = str(row['crime_type']) if pd.notna(row.get('crime_type')) else None
            date_val = str(row['date']) if pd.notna(row.get('date')) else None
            time_val = str(row['time']) if pd.notna(row.get('time')) else None
            area = str(row['area']) if pd.notna(row.get('area')) else None
            city = str(row['city']) if pd.notna(row.get('city')) else None
            latitude = float(row['latitude']) if pd.notna(row.get('latitude')) else None
            longitude = float(row['longitude']) if pd.notna(row.get('longitude')) else None
            description = str(row['description']) if pd.notna(row.get('description')) else None
            severity = str(row['severity']) if pd.notna(row.get('severity')) else None
            status = str(row['status']) if pd.notna(row.get('status')) else 'Open'

            if case_id is not None:
                cursor.execute("""
                    INSERT OR REPLACE INTO cases (
                        case_id, crime_type, date, time, area, city, latitude, longitude, description, severity, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (case_id, crime_type, date_val, time_val, area, city, latitude, longitude, description, severity, status))
            else:
                cursor.execute("""
                    INSERT INTO cases (
                        crime_type, date, time, area, city, latitude, longitude, description, severity, status
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (crime_type, date_val, time_val, area, city, latitude, longitude, description, severity, status))
            inserted_count += 1

        # Populate locations table if empty and data is present
        cursor.execute("SELECT COUNT(*) FROM locations")
        if cursor.fetchone()[0] == 0 and 'area' in df.columns and 'city' in df.columns:
            loc_cols = [c for c in ['area', 'city', 'latitude', 'longitude'] if c in df.columns]
            unique_locs = df[loc_cols].drop_duplicates(subset=['area', 'city'])
            for _, loc_row in unique_locs.iterrows():
                cursor.execute("""
                    INSERT INTO locations (area, city, latitude, longitude)
                    VALUES (?, ?, ?, ?)
                """, (
                    str(loc_row['area']) if pd.notna(loc_row.get('area')) else None,
                    str(loc_row['city']) if pd.notna(loc_row.get('city')) else None,
                    float(loc_row['latitude']) if pd.notna(loc_row.get('latitude')) else None,
                    float(loc_row['longitude']) if pd.notna(loc_row.get('longitude')) else None
                ))

        conn.commit()
        return inserted_count
    finally:
        conn.close()


def add_case(crime_type, date, time, area, city, latitude, longitude, description, severity, status='Open'):
    """
    Insert a new crime case into the database and return the generated case_id.
    
    Args:
        crime_type (str): Type of crime (e.g., 'Burglary', 'Robbery', 'Assault').
        date (str): Date of the crime (YYYY-MM-DD).
        time (str): Time of the crime (HH:MM).
        area (str): Neighborhood or area name.
        city (str): City name.
        latitude (float): Geographic latitude coordinate.
        longitude (float): Geographic longitude coordinate.
        description (str): Detailed case summary or report.
        severity (str): Severity rating ('Low', 'Medium', 'High', 'Critical').
        status (str, optional): Current case status. Defaults to 'Open'.
        
    Returns:
        int: The case_id of the newly created case.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO cases (
                crime_type, date, time, area, city, latitude, longitude, description, severity, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (crime_type, date, time, area, city, latitude, longitude, description, severity, status))
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()


def get_case(case_id):
    """
    Retrieve a single case by its ID and return it as a dictionary.
    
    Args:
        case_id (int): Unique identifier of the case.
        
    Returns:
        dict or None: Dictionary representing the case details, or None if not found.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_all_cases(filters=None):
    """
    Return list of cases as dicts, optionally filtered by criteria.
    
    Args:
        filters (dict, optional): Filter dictionary with supported keys:
            - crime_type (str): Specific crime type
            - area (str): Specific area
            - city (str): Specific city
            - severity (str): Severity level ('Low', 'Medium', 'High', 'Critical')
            - status (str): Status ('Open', 'Closed', 'Under Investigation')
            - date_from (str): Start date (inclusive, YYYY-MM-DD)
            - date_to (str): End date (inclusive, YYYY-MM-DD)
            - limit (int): Maximum number of records to return
            
    Returns:
        list[dict]: List of case records matching criteria as dictionaries.
    """
    conn = get_db_connection()
    try:
        query = "SELECT * FROM cases"
        conditions = []
        params = []

        if filters:
            if filters.get('crime_type'):
                conditions.append("crime_type = ?")
                params.append(filters['crime_type'])
            if filters.get('area'):
                conditions.append("area = ?")
                params.append(filters['area'])
            if filters.get('city'):
                conditions.append("city = ?")
                params.append(filters['city'])
            if filters.get('severity'):
                conditions.append("severity = ?")
                params.append(filters['severity'])
            if filters.get('status'):
                conditions.append("status = ?")
                params.append(filters['status'])
            if filters.get('date_from'):
                conditions.append("date >= ?")
                params.append(filters['date_from'])
            if filters.get('date_to'):
                conditions.append("date <= ?")
                params.append(filters['date_to'])

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY date DESC, case_id DESC"

        if filters and filters.get('limit'):
            query += f" LIMIT {int(filters['limit'])}"

        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def update_case(case_id, **kwargs):
    """
    Update specified fields of a crime case.
    
    Args:
        case_id (int): ID of the case to update.
        **kwargs: Column-value pairs to update (e.g. status='Closed', severity='High').
        
    Returns:
        bool: True if the record was successfully updated, False otherwise.
    """
    if not kwargs:
        return False

    valid_columns = {
        'crime_type', 'date', 'time', 'area', 'city',
        'latitude', 'longitude', 'description', 'severity', 'status'
    }

    updates = []
    params = []
    for col, val in kwargs.items():
        if col in valid_columns:
            updates.append(f"{col} = ?")
            params.append(val)

    if not updates:
        return False

    params.append(case_id)
    query = f"UPDATE cases SET {', '.join(updates)} WHERE case_id = ?"

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def delete_case(case_id):
    """
    Delete a case by case_id along with associated foreign key entities.
    
    Args:
        case_id (int): ID of the case to delete.
        
    Returns:
        bool: True if a case was deleted, False otherwise.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        # Clean up associated child records
        cursor.execute("DELETE FROM evidence WHERE case_id = ?", (case_id,))
        cursor.execute("DELETE FROM persons WHERE case_id = ?", (case_id,))
        cursor.execute("DELETE FROM vehicles WHERE case_id = ?", (case_id,))
        cursor.execute("DELETE FROM cases WHERE case_id = ?", (case_id,))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def search_cases(query):
    """
    Full-text search on description, crime_type, and area fields using SQL LIKE.
    
    Args:
        query (str): Substring or keyword to search for.
        
    Returns:
        list[dict]: List of matching cases as dictionaries.
    """
    if not query or not query.strip():
        return get_all_cases()

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        search_pattern = f"%{query.strip()}%"
        sql = """
            SELECT * FROM cases
            WHERE description LIKE ?
               OR crime_type LIKE ?
               OR area LIKE ?
            ORDER BY date DESC, case_id DESC
        """
        cursor.execute(sql, (search_pattern, search_pattern, search_pattern))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()


def get_cases_as_dataframe():
    """
    Return all cases as a pandas DataFrame (for ML/NLP use).
    
    Returns:
        pd.DataFrame: DataFrame containing all cases from the database.
    """
    conn = get_db_connection()
    try:
        df = pd.read_sql_query("SELECT * FROM cases ORDER BY case_id ASC", conn)
        return df
    finally:
        conn.close()


def add_user(username, password_hash, role='investigator'):
    """
    Add a new user to the users table.
    
    Args:
        username (str): Unique username.
        password_hash (str): Hashed password.
        role (str, optional): User role ('investigator', 'admin', etc.). Defaults to 'investigator'.
        
    Returns:
        int: The user_id of the newly inserted user.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (username, password_hash, role)
            VALUES (?, ?, ?)
        """, (username, password_hash, role))
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()


def get_user(username):
    """
    Get user by username.
    
    Args:
        username (str): Username to retrieve.
        
    Returns:
        dict or None: User record as a dictionary, or None if not found.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def log_action(user_id, action):
    """
    Add an audit log entry.
    
    Args:
        user_id (int or None): ID of the user performing the action.
        action (str): Description of the action performed.
        
    Returns:
        int: The log_id of the newly created log entry.
    """
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO audit_logs (user_id, action)
            VALUES (?, ?)
        """, (user_id, action))
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()


# Ensure database tables and initial CSV data are initialized on module load
init_db()

if __name__ == '__main__':
    init_db()
    cases = get_all_cases()
    print(f"Database initialized successfully. Total cases: {len(cases)}")
