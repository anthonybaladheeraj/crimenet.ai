from pathlib import Path

from extraction import extract_information
from similarity import find_similar_cases


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CSV = BASE_DIR / "data" / "crime_data.csv"


def analyze_crime(
    description,
    csv_file=DEFAULT_CSV,
    top_n=5,
    threshold=0.20
):
    if not description or not description.strip():
        raise ValueError(
            "Crime description cannot be empty."
        )

    extracted = extract_information(description)

    similar_cases = find_similar_cases(
        description,
        csv_file,
        top_n=top_n,
        threshold=threshold
    )

    return {
        "description": description.strip(),
        "extracted_information": extracted,
        "similar_cases": similar_cases.to_dict(
            orient="records"
        )
    }


if __name__ == "__main__":

    print("=== CrimeAI NLP Analysis ===")

    try:

        description = input(
            "\nEnter crime description: "
        ).strip()

        result = analyze_crime(description)

        print("\n=== Extracted Information ===")

        for key, value in result[
            "extracted_information"
        ].items():
            print(f"{key}: {value}")

        print("\n=== Similar Cases ===")

        cases = result["similar_cases"]

        if not cases:
            print("No sufficiently similar cases found.")

        else:
            for case in cases:
                print(
                    f"\nCase ID: {case['case_id']}"
                )
                print(
                    f"Similarity: "
                    f"{case['similarity']}%"
                )
                print(
                    f"Description: "
                    f"{case['description']}"
                )
                print("-" * 60)

    except (FileNotFoundError, ValueError) as error:

        print(f"\nError: {error}")

    except Exception as error:

        print(
            f"\nUnexpected error: {error}"
        )