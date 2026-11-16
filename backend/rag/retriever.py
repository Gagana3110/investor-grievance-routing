
from sentence_transformers import SentenceTransformer

from backend.rag.vector_store import load_vector_store
from backend.rag.embedder import MODEL_NAME


# Load model once when this module is imported
model = SentenceTransformer(MODEL_NAME)


def identify_regulator(document_name):
    """Identify the regulator from the document name."""

    name = document_name.lower()

    if "rbi" in name or "reserve bank of india" in name:
        return "RBI"

    if (
        "securities and exchange board of india" in name
        or "sebi" in name
    ):
        return "SEBI"

    return "UNKNOWN"


def search_corpus(
    query: str,
    top_k: int = 5,
    regulator: str = None,
    version: str = None
):
    """
    Search regulatory documents using semantic similarity.

    Optional filters:
        regulator: RBI or SEBI
        version: Document version, e.g. 2026

    Returns:
        List of passages with citation metadata and scores.
    """

    if not query or not query.strip():
        return []

    if top_k < 1:
        return []

    if regulator:
        regulator = regulator.upper()

        if regulator not in ["RBI", "SEBI"]:
            raise ValueError("Regulator must be RBI or SEBI")

    index, metadata = load_vector_store()

    # Embed the user's question
    query_embedding = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    # Search the complete index so filtering does not
    # accidentally remove relevant documents.
    candidate_k = index.ntotal

    scores, indices = index.search(
        query_embedding,
        candidate_k
    )

    results = []

    for score, idx in zip(scores[0], indices[0]):

        if idx == -1:
            continue

        result = metadata[idx].copy()

        # Apply regulator filter
        if regulator:
            actual_regulator = identify_regulator(
                result["document"]
            )

            if actual_regulator != regulator:
                continue

        # Apply version filter
        if version and str(result["version"]) != str(version):
            continue

        result["regulator"] = identify_regulator(
            result["document"]
        )

        result["similarity_score"] = float(score)

        results.append(result)

        if len(results) >= top_k:
            break

    return results


if __name__ == "__main__":

    query = (
        "I invested in a bank fixed deposit, "
        "but the bank credited less interest than promised."
    )

    results = search_corpus(
        query=query,
        top_k=5,
        regulator="RBI"
    )

    print("\nREGULATORY EVIDENCE")
    print("=" * 60)

    for i, result in enumerate(results, start=1):

        print(f"\nRESULT {i}")
        print("Regulator:", result["regulator"])
        print("Document:", result["document"])
        print("Version:", result["version"])
        print("Page:", result["page"])
        print("Similarity:", round(result["similarity_score"], 4))
        print("Source:", result["source_url"])
        print("\nPassage:")
        print(result["text"][:1000])
        print("-" * 60)
