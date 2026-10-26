# Architecture and implementation status

## Intended topology
React client -> FastAPI validation/API -> Redis-backed task queue -> LangGraph orchestration -> investigator and reviewer agents -> retrieval tools -> FAISS regulatory index -> verification gate -> result/status API.

Prometheus scrapes API metrics. Later integration adds OpenTelemetry traces exported to Jaeger and Grafana dashboards. Use a persistent store for run state, quarantine, and feedback before claiming production readiness.

## Current starter limitations
- API uses a local thread pool, not Redis-backed worker execution yet; Redis is provisioned for the next implementation step.
- Routing deliberately escalates because no official corpus has been loaded and verified.
- Feedback is not durable yet.
- The corpus manifest and evaluation set are starter scaffolds, not completed requirements.
- Do not report performance, evaluation, or cost metrics until they have been measured.
