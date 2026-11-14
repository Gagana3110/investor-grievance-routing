
import json
from pathlib import Path

from pypdf import PdfReader


# Project directory
PROJECT_ROOT = Path(__file__).resolve().parents[2]

CORPUS_DIR = PROJECT_ROOT / "corpus"
RAW_DIR = CORPUS_DIR / "raw"
MANIFEST_PATH = CORPUS_DIR / "manifest.json"


def load_manifest():
    """Load document metadata from manifest.json."""

    with open(MANIFEST_PATH, "r", encoding="utf-8") as file:
        manifest = json.load(file)

    return manifest["documents"]


def load_pdfs():
    """
    Extract text page by page from all PDFs listed
    in the corpus manifest.

    Returns a list of page records with metadata.
    """

    documents = load_manifest()
    pages = []

    for document in documents:
        filename = document["local_filename"]
        pdf_path = RAW_DIR / filename

        if not pdf_path.exists():
            print(f"WARNING: PDF not found: {filename}")
            continue

        print(f"Loading: {filename}")

        reader = PdfReader(str(pdf_path))

        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            text = " ".join(text.split())

            if not text:
                continue

            pages.append({
                "document": document["document"],
                "version": document["version"],
                "page": page_number,
                "source_url": document["source_url"],
                "text": text
            })

        print(f"Extracted {len(reader.pages)} pages from {filename}")

    return pages


if __name__ == "__main__":
    extracted_pages = load_pdfs()

    print("\nPDF EXTRACTION COMPLETE")
    print(f"Total extracted pages: {len(extracted_pages)}")

    if extracted_pages:
        print("\nSample extracted page:")
        print(extracted_pages[0])
