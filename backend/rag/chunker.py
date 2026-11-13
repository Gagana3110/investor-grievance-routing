from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_pages(pages):
    """
    Split extracted PDF pages into smaller chunks.

    Each chunk retains its document name, version,
    page number, and source URL.
    """

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=300,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

    chunks = []

    for page in pages:
        page_chunks = text_splitter.split_text(page["text"])

        for chunk_number, chunk_text in enumerate(page_chunks, start=1):
            chunks.append({
                "document": page["document"],
                "version": page["version"],
                "page": page["page"],
                "source_url": page["source_url"],
                "chunk_number": chunk_number,
                "text": chunk_text
            })

    return chunks