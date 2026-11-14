
from backend.rag.retriever import search_corpus as rag_search


def search_corpus(query: str) -> list[dict]:
    """
    Retrieve regulatory evidence using the RAG module
    and convert it into the backend evidence format.
    """
    if not query or not query.strip():
        return []

    results = rag_search(query=query, top_k=5)

    evidence = []

    for result in results:
        evidence.append({
            "text": result.get("text", ""),
            "source": result.get("document", ""),
            "section": f"Page {result.get('page', 'Unknown')}",
            "source_url": result.get("source_url"),
            "version": result.get("version"),
            "regulator": result.get("regulator"),
            "similarity_score": result.get("similarity_score"),
        })

    return evidence
