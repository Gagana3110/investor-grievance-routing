
# Regulatory RAG Module

## 1. Overview

This module retrieves relevant regulatory evidence from SEBI and RBI documents for the Investor Grievance Routing project.

It uses semantic search to find relevant passages and returns their source information for citation.

## 2. Regulatory Corpus

The current corpus contains four PDF files:

| Document | Version |
|---|---|
| RBI Integrated Ombudsman Scheme | 2021 |
| RBI Integrated Ombudsman Scheme | 2026 |
| SEBI Master Circular on Investor Grievances | 2022 |
| SEBI Mutual Funds Regulations | 2026 |

The two RBI PDFs represent different versions of one regulatory source.

## 3. Technology Stack

| Component | Technology |
|---|---|
| PDF extraction | PyPDF |
| Text chunking | LangChain Text Splitters |
| Embedding model | sentence-transformers/all-MiniLM-L6-v2 |
| Vector database | FAISS |
| Programming language | Python |

## 4. Pipeline Architecture

```text
Regulatory PDFs
      |
      v
loader.py
      |
      v
chunker.py
      |
      v
embedder.py
      |
      v
vector_store.py
      |
      v
FAISS Index
      |
      v
retriever.py
      |
      v
search_corpus(query)
      |
      v
Relevant regulatory evidence
```

## 5. Project Files

| File | Responsibility |
|---|---|
| loader.py | Extracts text and metadata from PDFs |
| chunker.py | Splits extracted text into smaller chunks |
| embedder.py | Generates numerical embeddings |
| vector_store.py | Saves and loads FAISS index and metadata |
| build_index.py | Runs the complete indexing pipeline |
| retriever.py | Searches for relevant regulatory passages |
| evaluate.py | Tests retrieval on sample complaint scenarios |

## 6. Build the FAISS Index

From the project root, run:

```bash
python -m backend.rag.build_index
```

This extracts PDFs, creates chunks, generates embeddings and saves the vector index.

Generated files:

```text
corpus/index/
    regulatory.index
    metadata.json
```

## 7. Using the Retrieval Function

Import the function:

```python
from backend.rag.retriever import search_corpus
```

### Search all regulatory documents

```python
results = search_corpus(
    "My bank has not resolved my complaint",
    top_k=5
)
```

### Search RBI documents only

```python
results = search_corpus(
    "Banking grievance",
    top_k=5,
    regulator="RBI"
)
```

### Search SEBI documents only

```python
results = search_corpus(
    "Mutual fund redemption delay",
    top_k=5,
    regulator="SEBI"
)
```

### Search a specific version

```python
results = search_corpus(
    "Banking grievance",
    top_k=5,
    regulator="RBI",
    version="2026"
)
```

## 8. Retrieval Response

Each result contains:

- document
- version
- page
- source_url
- chunk_number
- text
- regulator
- similarity_score

Example:

```python
for result in results:
    print(result["text"])
    print(result["document"])
    print(result["page"])
    print(result["source_url"])
    print(result["similarity_score"])
```

## 9. Evaluation

Run:

```bash
python -m backend.rag.evaluate
```

The current evaluation includes four complaint scenarios:

1. Bank fixed deposit interest dispute
2. Unauthorized bank transaction
3. Mutual fund redemption delay
4. Stockbroker complaint

The initial document-level evaluation passed all four scenarios.

Separate RBI-only and SEBI-only retrieval filter tests also passed.

These results validate basic retrieval behavior, not legal classification accuracy.

## 10. Important Notes

- The FAISS index must be built before retrieval.
- The embedding model is downloaded on its first use.
- Similarity scores indicate semantic similarity, not legal correctness.
- Regulator filters restrict document retrieval; they do not independently determine jurisdiction.
- Retrieved passages should be checked before using them as regulatory evidence.
- The backend agent should use the returned text and citation metadata when preparing its response.
