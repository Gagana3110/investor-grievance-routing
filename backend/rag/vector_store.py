import json
from pathlib import Path

import faiss
import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[2]
INDEX_DIR = PROJECT_ROOT / "corpus" / "index"

INDEX_PATH = INDEX_DIR / "regulatory.index"
METADATA_PATH = INDEX_DIR / "metadata.json"


def save_vector_store(embeddings, chunks):
    INDEX_DIR.mkdir(parents=True, exist_ok=True)

    vectors = np.asarray(embeddings, dtype="float32")

    index = faiss.IndexFlatIP(vectors.shape[1])
    index.add(vectors)

    faiss.write_index(index, str(INDEX_PATH))

    with open(METADATA_PATH, "w", encoding="utf-8") as file:
        json.dump(chunks, file, indent=2, ensure_ascii=False)

    print(f"FAISS index saved: {INDEX_PATH}")
    print(f"Metadata saved: {METADATA_PATH}")

def load_vector_store():
    """Load the saved FAISS index and metadata."""

    if not INDEX_PATH.exists() or not METADATA_PATH.exists():
        raise FileNotFoundError(
            "Vector store not found. Run the indexing pipeline first."
        )

    index = faiss.read_index(str(INDEX_PATH))

    with open(METADATA_PATH, "r", encoding="utf-8") as file:
        metadata = json.load(file)

    return index, metadata