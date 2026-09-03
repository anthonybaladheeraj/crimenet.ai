"""
app.py — Flask Application Entry Point for CrimeAI.

Initializes the Flask app, configures the secret key, registers
route blueprints, and serves as the single entry point to run the
entire backend.
"""

import os
import sys

# Add the project root to sys.path so all modules can be imported
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from flask import Flask

# Import and initialize the database (creates tables + loads CSV on first run)
from database.db import init_db


def create_app():
    """
    Application factory — creates and configures the Flask app.

    Returns:
        Flask: Configured Flask application instance.
    """
    app = Flask(
        __name__,
        template_folder=os.path.join(PROJECT_ROOT, 'frontend'),
        static_folder=os.path.join(PROJECT_ROOT, 'frontend'),
        static_url_path='/static'
    )

    # Secret key for session management (change in production)
    app.config['SECRET_KEY'] = 'crimeai-secret-key-change-in-production'

    # Initialize the database
    init_db()

    # Register the API routes blueprint
    from app.routes import api_bp
    app.register_blueprint(api_bp)

    # ----- Simple index route for testing -----
    @app.route('/')
    def index():
        return {
            'status': 'ok',
            'message': 'CrimeAI Backend is running',
            'endpoints': {
                'cases': '/api/cases',
                'single_case': '/api/cases/<id>',
                'search': '/api/cases/search?q=<query>',
                'hotspots': '/api/hotspots',
                'patterns': '/api/patterns',
                'anomalies': '/api/anomalies',
                'similar': '/api/similar/<id>',
                'assistant': '/api/assistant',
                'login': '/auth/login',
            }
        }

    return app


# ----- Run the server -----
if __name__ == '__main__':
    app = create_app()
    print("\n=== CrimeAI Backend Server ===")
    print("Running at http://127.0.0.1:5000")
    print("Press Ctrl+C to stop\n")
    app.run(debug=True, port=5000)
