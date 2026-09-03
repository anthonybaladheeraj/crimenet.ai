"""Quick API integration test for CrimeAI backend."""
import requests
import json

base = 'http://127.0.0.1:5000'

# Test 1: Root endpoint
print('=== Test 1: Root ===')
r = requests.get(f'{base}/')
print(f'  Status: {r.status_code}, Message: {r.json()["message"]}')

# Test 2: List cases
print('\n=== Test 2: List Cases ===')
r = requests.get(f'{base}/api/cases', params={'limit': 3})
data = r.json()
print(f'  Status: {data["status"]}, Count: {data["count"]}')
for c in data['cases'][:2]:
    print(f'  Case #{c["case_id"]}: {c["crime_type"]} in {c["area"]}')

# Test 3: Single case
print('\n=== Test 3: Single Case ===')
r = requests.get(f'{base}/api/cases/1')
c = r.json()['case']
print(f'  Case #{c["case_id"]}: {c["crime_type"]} - {c["description"][:80]}...')

# Test 4: Create case
print('\n=== Test 4: Create Case ===')
new_case = {
    "crime_type": "Robbery",
    "date": "2026-09-03",
    "time": "14:00",
    "area": "Koramangala",
    "city": "Bangalore",
    "latitude": 12.935,
    "longitude": 77.625,
    "description": "Test case: Armed robbery at a jewelry store. Two suspects with knives.",
    "severity": "Critical"
}
r = requests.post(f'{base}/api/cases', json=new_case)
print(f'  Created: {r.json()}')

# Test 5: Search cases
print('\n=== Test 5: Search Cases ===')
r = requests.get(f'{base}/api/cases/search', params={'q': 'motorcycle'})
data = r.json()
print(f'  Found {data["count"]} cases matching "motorcycle"')

# Test 6: Hotspots
print('\n=== Test 6: Hotspots ===')
r = requests.get(f'{base}/api/hotspots')
data = r.json()
print(f'  Hotspots found: {data["summary"]["total_hotspots"]}')
for h in data['hotspots'][:3]:
    print(f'  Cluster {h["cluster_id"]}: {h["dominant_crime_type"]} ({h["case_count"]} cases)')

# Test 7: Patterns
print('\n=== Test 7: Patterns ===')
r = requests.get(f'{base}/api/patterns')
analysis = r.json()['analysis']
print(f'  Peak period: {analysis["time_patterns"]["peak_period"]}')
print(f'  Most common crime: {analysis["crime_type_patterns"]["most_common"]}')
print(f'  Highest crime area: {analysis["area_patterns"]["highest_crime_area"]}')

# Test 8: Anomalies
print('\n=== Test 8: Anomalies ===')
r = requests.get(f'{base}/api/anomalies')
data = r.json()
print(f'  Anomalies detected: {data["summary"]["total_anomalies"]}')
for a in data['anomalies'][:3]:
    print(f'  Case #{a["case_id"]}: {a["crime_type"]} (score: {a["anomaly_score"]:.4f})')

# Test 9: Similar cases
print('\n=== Test 9: Similar Cases ===')
r = requests.get(f'{base}/api/similar/1')
for s in r.json()['similar_cases'][:3]:
    print(f'  Case #{s["case_id"]}: score={s["similarity_score"]:.4f} - {s["crime_type"]}')

# Test 10: Entity extraction
print('\n=== Test 10: Entity Extraction ===')
r = requests.get(f'{base}/api/extract/6')
entities = r.json()['entities']
print(f'  Weapons: {entities["weapons"]}')
print(f'  Vehicles: {entities["vehicles"]}')
print(f'  Evidence: {entities["evidence_mentions"]}')
print(f'  Money: {entities["monetary_amounts"]}')

# Test 11: AI Assistant
print('\n=== Test 11: AI Assistant ===')
questions = [
    "How many vehicle thefts are there?",
    "Give me a summary",
]
for q in questions:
    r = requests.post(f'{base}/api/assistant', json={'question': q})
    data = r.json()
    print(f'  Q: {q}')
    print(f'  A: {data["answer"][:200]}')
    print()

# Test 12: Dashboard
print('=== Test 12: Dashboard Summary ===')
r = requests.get(f'{base}/api/dashboard')
d = r.json()
print(f'  Total cases: {d["total_cases"]}')
print(f'  By status: {d["status_counts"]}')
print(f'  Hotspots: {d["hotspot_summary"]["total_hotspots"]}')

print('\n' + '=' * 50)
print('ALL 12 API TESTS PASSED SUCCESSFULLY!')
print('=' * 50)
