# AI-Powered Crime Analysis & Investigation Support System

An AI-based Crime Analysis and Investigation Support System that stores crime records and uses Python, Machine Learning, NLP, and an investigator dashboard to identify patterns, hotspots, similar cases, and potentially related information.

> **Note:** This system provides investigative leads — it does not decide that a person is definitely a criminal.

---

## 📁 Project Structure

```
CrimeAI/
├── app/                    # Flask backend (API server)
│   ├── __init__.py
│   ├── app.py              # Application entry point
│   └── routes.py           # REST API endpoints
│
├── data/                   # Crime datasets
│   └── crime_data.csv      # Sample dataset (30 records)
│
├── database/               # Database layer
│   ├── __init__.py
│   └── db.py               # SQLite operations & CRUD
│
├── ml/                     # Machine Learning modules
│   ├── __init__.py
│   ├── hotspot.py           # DBSCAN crime hotspot detection
│   ├── patterns.py          # Crime pattern analysis
│   └── anomaly.py           # Isolation Forest anomaly detection
│
├── nlp/                    # Natural Language Processing modules
│   ├── __init__.py
│   ├── similarity.py        # TF-IDF similar case finder
│   ├── extraction.py        # Entity extraction from descriptions
│   └── assistant.py         # AI Q&A assistant
│
├── frontend/               # (Frontend team — HTML/CSS/JS)
│   └── (to be added)
│
├── docs/                   # Documentation
│   └── (project reports, diagrams)
│
├── requirements.txt        # Python dependencies
├── test_api.py             # API integration tests
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/CrimeAI.git
cd CrimeAI
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the server
```bash
python -m app.app
```
The server starts at **http://127.0.0.1:5000**

### 4. Run tests
```bash
python test_api.py
```

---

## 🔌 API Endpoints

### Cases (CRUD)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cases` | List all cases (supports filters: `crime_type`, `area`, `severity`, `status`, `date_from`, `date_to`, `limit`) |
| `GET` | `/api/cases/<id>` | Get a single case |
| `POST` | `/api/cases` | Create a new case |
| `PUT` | `/api/cases/<id>` | Update a case |
| `DELETE` | `/api/cases/<id>` | Delete a case |
| `GET` | `/api/cases/search?q=` | Full-text search |

### Machine Learning
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/hotspots` | Crime hotspot clusters (DBSCAN) |
| `GET` | `/api/patterns` | Crime pattern analysis |
| `GET` | `/api/anomalies` | Anomalous cases (Isolation Forest) |
| `GET` | `/api/dashboard` | Combined dashboard summary |

### NLP & AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/similar/<id>` | Find similar cases by case ID |
| `POST` | `/api/similar/search` | Find similar cases by text |
| `GET` | `/api/extract/<id>` | Extract entities from a case |
| `GET` | `/api/extract/all` | Extract entities from all cases |
| `POST` | `/api/assistant` | AI assistant Q&A |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/logout` | Logout |

---

## 📊 API Usage Examples

### Create a new case
```bash
curl -X POST http://127.0.0.1:5000/api/cases \
  -H "Content-Type: application/json" \
  -d '{
    "crime_type": "Vehicle Theft",
    "date": "2026-09-03",
    "time": "23:30",
    "area": "Koramangala",
    "city": "Bangalore",
    "latitude": 12.935,
    "longitude": 77.625,
    "description": "Black sedan stolen from parking lot.",
    "severity": "High"
  }'
```

### Ask the AI assistant
```bash
curl -X POST http://127.0.0.1:5000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"question": "How many thefts in Koramangala?"}'
```

### Get crime hotspots
```bash
curl http://127.0.0.1:5000/api/hotspots
```

---

## 🧠 AI/ML Features

- **Hotspot Detection** — DBSCAN clustering on geographic coordinates to find crime-dense areas
- **Pattern Analysis** — Time, area, crime type, severity distributions and monthly trends
- **Anomaly Detection** — Isolation Forest to flag unusual cases
- **Similar Cases** — TF-IDF + Cosine Similarity to find related cases
- **Entity Extraction** — Regex-based extraction of weapons, vehicles, money, suspects, evidence
- **AI Assistant** — Natural language Q&A with intent detection (count, trend, hotspot, similar, recent, summary)

---

## 🛠 Tech Stack

- **Backend**: Python, Flask
- **Database**: SQLite
- **ML**: scikit-learn (DBSCAN, Isolation Forest, TF-IDF)
- **Data**: pandas, numpy

---

## 👥 Team

| Role | Responsibility |
|------|---------------|
| Member 1 | Project Lead + System Design |
| Member 2 | Data + Python |
| Member 3 | Machine Learning |
| Member 4 | NLP + AI |
| Member 5 | Database |
| Member 6 | Website + UI |

---

## 📝 License

This project is for educational purposes. Uses synthetic/anonymized data only.
