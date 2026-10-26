from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    assert client.get('/health').status_code == 200

def test_reject_short_complaint():
    response = client.post('/v1/complaints', json={'complaint_text':'short'})
    assert response.status_code == 422

def test_valid_request_gets_run_id():
    response = client.post('/v1/complaints', json={'complaint_text':'I invested in a bank fixed deposit and the credited interest is incorrect.'})
    assert response.status_code == 202
    assert response.json()['run_id']
