# Investor Grievance Routing Service

It is designed to grow into a multi-agent, evidence-grounded routing service. It does **not** make legal decisions: outputs are recommendations for a human grievance officer.

## Stack
- FastAPI API + background run/status endpoints
- LangGraph/LangChain + FAISS retrieval (planned integration)
- Redis queue (Compose service; worker scaffold to be added)
- React/Vite client (scaffold)
- Prometheus/Grafana/Jaeger observability (scaffold)

## First run
1. Install Docker Desktop.
2. Copy `.env.example` to `.env` and fill in provider settings if using a hosted model.
3. Run `docker compose up --build`.
4. Open http://localhost:8000/docs and http://localhost:5173.

The starter API can accept a complaint and return a run ID; routing must be based on verified regulatory corpus passages before it is used for demonstrations. Do not submit real investor personal data or send complaints to any regulator.

## Corpus
Place official, current versions of the three assigned documents in `corpus/raw/`:
- SEBI master circular on investor grievance redressal
- SEBI (Mutual Funds) Regulations, investor-servicing provisions
- RBI Integrated Ombudsman Scheme

Record source URL, publication/version date, retrieval date, and checksum in `corpus/manifest.json`. Do not treat the sample rules or synthetic scenarios as legal advice.

## Development order
1. Corpus + source manifest and difficult fixed-deposit test case.
2. Schema validation/quarantine and API health endpoint.
3. Indexing and retrieval tools.
4. Investigator and independent reviewer agents with a hard verification gate.
5. Frontend, Compose health checks, observability.
6. 20+ evaluation cases, prompt comparison, injection tests, Locust stub-load test.

## Safety
The service only recommends routing. Unverified, unsupported, conflicting, multi-regulator, or out-of-corpus cases must be escalated. Never fabricate citations or timelines.
