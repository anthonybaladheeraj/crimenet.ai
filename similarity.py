from pathlib import Path
import re
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CSV = BASE_DIR / "data" / "crime_data.csv"


# Normalize related crime words
WORD_GROUPS = {
    "theft": [
        "theft",
        "stolen",
        "stole",
        "stealing"
    ],
    "robbery": [
        "robbery",
        "robbed",
        "robbing"
    ],
    "murder": [
        "murder",
        "murdered",
        "killed",
        "killing",
        "homicide"
    ],
    "burglary": [
        "burglary",
        "burglar",
        "break-in",
        "breakin"
    ],
    "snatching": [
        "snatched",
        "snatching"
    ],
    "fraud": [
        "fraud",
        "fraudulent",
        "scam",
        "scammed"
    ],
    "assault": [
        "assault",
        "attacked",
        "attack"
    ]
}


def normalize_text(text):
    text = str(text).lower()

    for base_word, related_words in WORD_GROUPS.items():
        for word in related_words:
            text = re.sub(
                r"\b" + re.escape(word) + r"\b",
                base_word,
                text
            )

    return text


def load_data(csv_file):
    csv_path = Path(csv_file).resolve()

    if not csv_path.exists():
        raise FileNotFoundError(
            f"Crime data file not found: {csv_path}"
        )

    df = pd.read_csv(csv_path)

    required_columns = {"case_id", "description"}

    missing = required_columns - set(df.columns)

    if missing:
        raise ValueError(
            f"Missing columns: {', '.join(missing)}"
        )

    df = df.dropna(
        subset=["case_id", "description"]
    ).copy()

    df["description"] = (
        df["description"]
        .astype(str)
        .str.strip()
    )

    df = df[df["description"] != ""]

    df = df.drop_duplicates(
        subset=["description"]
    ).reset_index(drop=True)

    if df.empty:
        raise ValueError("Crime dataset is empty.")

    return df


def find_similar_cases(
    new_description,
    csv_file=DEFAULT_CSV,
    top_n=5,
    threshold=0.10
):

    if not new_description or not new_description.strip():
        raise ValueError(
            "Crime description cannot be empty."
        )

    df = load_data(csv_file)

    normalized_query = normalize_text(
        new_description
    )

    normalized_cases = [
        normalize_text(description)
        for description in df["description"]
    ]

    all_text = [
        normalized_query
    ] + normalized_cases

    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2)
    )

    vectors = vectorizer.fit_transform(
        all_text
    )

    scores = cosine_similarity(
        vectors[0:1],
        vectors[1:]
    )[0]

    df["similarity_score"] = scores

    df = df[
        df["similarity_score"] >= threshold
    ]

    if df.empty:
        return pd.DataFrame(
            columns=[
                "case_id",
                "description",
                "similarity"
            ]
        )

    df = df.sort_values(
        "similarity_score",
        ascending=False
    ).head(top_n)

    df["similarity"] = (
        df["similarity_score"] * 100
    ).round(2)

    return df[
        [
            "case_id",
            "description",
            "similarity"
        ]
    ]


if __name__ == "__main__":

    print("=== Crime Similarity Search ===")

    try:

        new_case = input(
            "\nEnter crime description: "
        ).strip()

        results = find_similar_cases(
            new_case
        )

        print("\n=== Similar Cases ===")

        if results.empty:

            print(
                "No sufficiently similar cases found."
            )

        else:

            for _, row in results.iterrows():

                print(
                    f"\nCase ID: {row['case_id']}"
                )

                print(
                    f"Similarity: "
                    f"{row['similarity']}%"
                )

                print(
                    f"Description: "
                    f"{row['description']}"
                )

                print("-" * 60)

    except Exception as error:

        print(f"\nError: {error}")