from concurrent.futures import ThreadPoolExecutor
from threading import Lock
from uuid import uuid4
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import JSONResponse
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
from .schemas import ComplaintRequest, RoutingResult

app = FastAPI(title="Investor Grievance Routing Service", version="0.1.0",
              description="Evidence-grounded routing recommendations for human review; not a complaint adjudication service.")
executor = ThreadPoolExecutor(max_workers=3)
runs: dict[str, dict] = {}
quarantine: list[dict] = []
lock = Lock()
REQUESTS = Counter("complaint_submissions_total", "Complaint submissions", ["outcome"])


def process_complaint(run_id: str, complaint: ComplaintRequest):
    """Safe placeholder: never assert jurisdiction without loaded, verified corpus passages."""
    try:
        text = complaint.complaint_text.lower()
        # This is a triage hint only, deliberately not a regulatory conclusion.
        bank_terms = ("fixed deposit", "bank deposit", "bank's app", "bank app")
        possible_bank_product = any(term in text for term in bank_terms)
        result = RoutingResult(
            status="needs_human_review",
            route_type="human_escalation",
            recommended_regulator=None,
            responsible_entity=complaint.entity_name,
            timeline=None,
            reason=("The complaint mentions a possible banking product. Verify the product and applicable official scheme in the regulatory corpus before routing."
                    if possible_bank_product else
                    "No verified corpus-backed routing is available in this starter build. Retrieve and verify applicable provisions before recommending a route."),
            citations=[],
            escalation_reason="Starter build has no verified regulatory index yet; do not infer a route without source passages.",
            human_review_required=True,
        )
        with lock:
            runs[run_id] = {"status": "completed", "result": result.model_dump(mode="json"), "created_at": datetime.now(timezone.utc).isoformat()}
    except Exception as exc:
        with lock:
            runs[run_id] = {"status": "failed", "error": type(exc).__name__}

@app.get("/health")
def health():
    return {"status": "ok", "service": "api", "time": datetime.now(timezone.utc).isoformat()}

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/v1/complaints", status_code=202)
def submit_complaint(complaint: ComplaintRequest):
    if not complaint.consent_to_process:
        raise HTTPException(400, "consent_to_process must be true for this demo")
    run_id = str(uuid4())
    with lock:
        runs[run_id] = {"status": "queued", "created_at": datetime.now(timezone.utc).isoformat()}
    executor.submit(process_complaint, run_id, complaint)
    REQUESTS.labels(outcome="accepted").inc()
    return {"run_id": run_id, "status": "queued", "status_url": f"/v1/runs/{run_id}"}

@app.get("/v1/runs/{run_id}")
def get_run(run_id: str):
    with lock:
        record = runs.get(run_id)
    if not record:
        raise HTTPException(404, "run_id not found")
    return record

@app.post("/v1/feedback")
def feedback(payload: dict):
    required = {"run_id", "satisfactory", "reason"}
    if not required.issubset(payload) or not isinstance(payload["satisfactory"], bool) or not str(payload["reason"]).strip():
        raise HTTPException(422, "Expected run_id, boolean satisfactory, and non-empty reason")
    # TODO: persist to a database; this temporary in-memory endpoint is not durable.
    return JSONResponse(status_code=202, content={"accepted": True, "persisted": False, "note": "Persistence is not yet configured."})
