
from backend.rag.retriever import search_corpus


TEST_CASES = [
    {
        "name": "Bank fixed deposit interest dispute",
        "query": (
            "I invested in a bank fixed deposit but the bank "
            "credited less interest than promised."
        ),
        "expected_regulator": "RBI",
    },
    {
        "name": "Unauthorized bank transaction",
        "query": (
            "Money was withdrawn from my bank account "
            "without my permission."
        ),
        "expected_regulator": "RBI",
    },
    {
        "name": "Mutual fund redemption delay",
        "query": (
            "My mutual fund company has not processed "
            "my redemption request."
        ),
        "expected_regulator": "SEBI",
    },
    {
        "name": "Stockbroker complaint",
        "query": (
            "My stockbroker has failed to resolve my "
            "complaint about an incorrect trade."
        ),
        "expected_regulator": "SEBI",
    },
]


def identify_regulator(document_name):
    name = document_name.lower()

    if "rbi" in name or "reserve bank of india" in name:
        return "RBI"

    if (
        "securities and exchange board of india" in name
        or "sebi" in name
    ):
        return "SEBI"

    return None


def evaluate_retrieval():

    passed = 0
    total = len(TEST_CASES)

    print("\nREGULATORY RAG EVALUATION")
    print("=" * 65)

    for case in TEST_CASES:

        results = search_corpus(
            query=case["query"],
            top_k=5
        )

        retrieved_regulators = {
            identify_regulator(result["document"])
            for result in results
        }

        retrieved_regulators.discard(None)

        expected = case["expected_regulator"]

        success = expected in retrieved_regulators

        if success:
            passed += 1

        print(f"\nTest: {case['name']}")
        print("Expected:", expected)
        print("Retrieved:", sorted(retrieved_regulators))
        print("Status:", "PASS" if success else "CHECK")

        for result in results:
            print(
                f"  {result['document']} | "
                f"Page {result['page']} | "
                f"Score {result['similarity_score']:.4f}"
            )

    print("\n" + "=" * 65)
    print(f"Tests passed: {passed}/{total}")
    print(f"Tests needing review: {total - passed}")


if __name__ == "__main__":
    evaluate_retrieval()
