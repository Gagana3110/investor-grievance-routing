
from concurrent.futures import ThreadPoolExecutor
from threading import Lock
from uuid import uuid4
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

from .schemas import ComplaintRequest, RoutingResult
from .graph import routing_graph


app = FastAPI(
    title="Investor Grievance Routing Service",
    version="0.1.0",
    description=(
        "Evidence-grounded routing recommendations for human review; "
        "not a complaint adjudication service."
    ),
)

# CORS configuration for the React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# Background processing
executor = ThreadPoolExecutor(max_workers=3)

runs: dict[str, dict] = {}
quarantine: list[dict] = []
lock = Lock()

REQUESTS = Counter(
    "complaint_submissions_total",
    "Complaint submissions",
    ["outcome"],
)


def process_complaint(run_id: str, complaint: ComplaintRequest):
    """Run the LangGraph workflow and safely store its result."""

    try:
        output = routing_graph.invoke({
            "complaint_text": complaint.complaint_text,
            "entity_name": complaint.entity_name,
        })

        data = output["result"]

        result = RoutingResult(
            status=data["status"],
            route_type=data["route_type"],
            recommended_regulator=data.get("recommended_regulator"),
            responsible_entity=data.get("responsible_entity"),
            reason=data["reason"],
            citations=data.get("citations", []),
            escalation_reason=data.get("escalation_reason"),
            human_review_required=data.get("human_review_required", True),
        )

        with lock:
            runs[run_id] = {
                "status": "completed",
                "result": result.model_dump(mode="json"),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }

    except Exception:
        with lock:
            runs[run_id] = {
                "status": "failed",
                "error": "Complaint processing failed. Please retry or escalate.",
                "created_at": datetime.now(timezone.utc).isoformat(),
            }


# Health check
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "api",
        "time": datetime.now(timezone.utc).isoformat(),
    }


# Prometheus metrics
@app.get("/metrics")
def metrics():
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST,
    )


# Submit complaint
@app.post("/v1/complaints", status_code=202)
def submit_complaint(complaint: ComplaintRequest):

    if not complaint.consent_to_process:
        raise HTTPException(
            status_code=400,
            detail="consent_to_process must be true for this demo",
        )

    run_id = str(uuid4())

    with lock:
        runs[run_id] = {
            "status": "queued",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

    executor.submit(process_complaint, run_id, complaint)

    REQUESTS.labels(outcome="accepted").inc()

    return {
        "run_id": run_id,
        "status": "queued",
        "status_url": f"/v1/runs/{run_id}",
    }


# Get complaint processing result
@app.get("/v1/runs/{run_id}")
def get_run(run_id: str):

    with lock:
        record = runs.get(run_id)

    if not record:
        raise HTTPException(
            status_code=404,
            detail="run_id not found",
        )

    return record


# Submit user feedback
@app.post("/v1/feedback")
def feedback(payload: dict):

    required = {"run_id", "satisfactory", "reason"}

    if (
        not required.issubset(payload)
        or not isinstance(payload["satisfactory"], bool)
        or not str(payload["reason"]).strip()
    ):
        raise HTTPException(
            status_code=422,
            detail="Expected run_id, boolean satisfactory, and non-empty reason",
        )

    # TODO: Persist feedback to a database.
    return JSONResponse(
        status_code=202,
        content={
            "accepted": True,
            "persisted": False,
            "note": "Persistence is not yet configured.",
        },
    )
