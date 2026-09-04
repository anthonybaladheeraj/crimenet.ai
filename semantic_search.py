from pathlib import Path

import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CSV = BASE_DIR / "data" / "crime_data.csv"

MODEL = SentenceTransformer("all-MiniLM-L6-v2")


VEHICLE_GROUPS = {
    "bike": ["bike", "motorcycle", "motorbike"],
    "motorcycle": ["bike", "motorcycle", "motorbike"],
    "motorbike": ["bike", "motorcycle", "motorbike"],
    "car": ["car"],
    "scooter": ["scooter"],
    "truck": ["truck"],
    "bus": ["bus"],
    "van": ["van"],
    "auto": ["auto"]
}


def detect_vehicle(query):

    query = query.lower()

    for vehicle, keywords in VEHICLE_GROUPS.items():
        for keyword in keywords:
            if keyword in query:
                return keywords

    return None


def semantic_search(
    query,
    csv_file=DEFAULT_CSV,
    top_n=5,
    threshold=0.30
):

    if not query or not query.strip():
        raise ValueError("Search query cannot be empty.")

    csv_path = Path(csv_file)

    if not csv_path.exists():
        raise FileNotFoundError(
            f"Crime data file not found: {csv_path}"
        )

    df = pd.read_csv(csv_path)

    if "case_id" not in df.columns:
        raise ValueError("CSV must contain 'case_id'.")

    if "description" not in df.columns:
        raise ValueError("CSV must contain 'description'.")

    df = df.dropna(
        subset=["case_id", "description"]
    ).copy()

    df["description"] = (
        df["description"]
        .astype(str)
        .str.strip()
    )

    df = df[df["description"] != ""]

    if df.empty:
        return pd.DataFrame(
            columns=[
                "case_id",
                "description",
                "similarity"
            ]
        )

    # Detect specific vehicle requested by user
    vehicle_keywords = detect_vehicle(query)

    # If a vehicle is mentioned, filter cases first
    if vehicle_keywords:

        pattern = "|".join(vehicle_keywords)

        df = df[
            df["description"]
            .str.lower()
            .str.contains(
                pattern,
                regex=True,
                na=False
            )
        ].copy()

        if df.empty:
            return pd.DataFrame(
                columns=[
                    "case_id",
                    "description",
                    "similarity"
                ]
            )

    query_embedding = MODEL.encode(
        [query]
    )

    case_embeddings = MODEL.encode(
        df["description"].tolist()
    )

    scores = cosine_similarity(
        query_embedding,
        case_embeddings
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

    df["similarity"] = [
        round(float(score) * 100, 2)
        for score in df["similarity_score"]
    ]

    return df[
        [
            "case_id",
            "description",
            "similarity"
        ]
    ]


if __name__ == "__main__":

    print("=== CrimeAI Semantic Search ===")

    try:

        query = input(
            "\nEnter your search: "
        ).strip()

        results = semantic_search(query)

        print("\n=== Results ===")

        if results.empty:

            print(
                "No matching cases found."
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