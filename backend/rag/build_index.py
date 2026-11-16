from backend.rag.loader import load_pdfs
from backend.rag.chunker import chunk_pages
from backend.rag.embedder import generate_embeddings
from backend.rag.vector_store import save_vector_store


def build_index():
    print("\nSTEP 1: Extracting PDF text...")
    pages = load_pdfs()

    print("\nSTEP 2: Splitting text into chunks...")
    chunks = chunk_pages(pages)

    print("\nSTEP 3: Generating embeddings...")
    embeddings, metadata = generate_embeddings(chunks)

    print("\nSTEP 4: Saving FAISS index...")
    save_vector_store(embeddings, chunks)
    
    print("\n" + "=" * 45)
    print("REGULATORY RAG INDEX BUILT SUCCESSFULLY")
    print("=" * 45)
    print(f"Pages processed: {len(pages)}")
    print(f"Chunks created: {len(chunks)}")
    print(f"Vectors indexed: {embeddings.shape[0]}")
    print(f"Vector dimensions: {embeddings.shape[1]}")


if __name__ == "__main__":
    build_index()