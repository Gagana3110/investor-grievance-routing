from sentence_transformers import SentenceTransformer


# Lightweight embedding model
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def generate_embeddings(chunks):
    """
    Convert text chunks into numerical vectors.

    Returns:
        embeddings: Numerical vectors
        metadata: Metadata for each corresponding chunk
    """

    model = SentenceTransformer(MODEL_NAME)

    texts = [chunk["text"] for chunk in chunks]

    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    metadata = [
        {key: value for key, value in chunk.items() if key != "text"}
        for chunk in chunks
    ]

    return embeddings, metadata