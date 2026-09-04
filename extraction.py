import re


CRIME_TYPES = {
    "robbery": [
        "robbery", "robbed", "mugging", "mugged"
    ],
    "murder": [
        "murder", "murdered", "homicide", "killed", "killing"
    ],
    "burglary": [
        "burglary", "break-in", "break in", "burglar"
    ],
    "snatching": [
        "snatched", "snatching", "chain snatching"
    ],
    "fraud": [
        "fraud", "fraudulent", "scam", "scammed", "cheating"
    ],
    "assault": [
        "assault", "attacked", "attack"
    ],
    "theft": [
        "theft", "stolen", "stole", "stealing"
    ]
}

VEHICLES = [
    "car", "motorcycle", "motorbike", "bike",
    "scooter", "truck", "bus", "auto", "van"
]

COLORS = [
    "red", "blue", "black", "white", "green",
    "yellow", "silver", "grey", "gray", "brown"
]

WEAPONS = [
    "knife", "gun", "pistol", "rifle",
    "sword", "weapon", "blade", "iron rod"
]


def contains_keyword(text, keyword):
    pattern = r"\b" + re.escape(keyword) + r"\b"
    return re.search(pattern, text) is not None


def extract_crime_types(text):
    text = text.lower()
    found = []

    for crime, keywords in CRIME_TYPES.items():
        for keyword in keywords:
            if contains_keyword(text, keyword):
                found.append(crime)
                break

    return found


def extract_crime_type(text):
    crimes = extract_crime_types(text)

    if not crimes:
        return "unknown"

    # Higher-priority crime categories
    priority = [
        "murder",
        "robbery",
        "burglary",
        "snatching",
        "assault",
        "fraud",
        "theft"
    ]

    for crime in priority:
        if crime in crimes:
            return crime

    return crimes[0]


def extract_vehicles(text):
    text = text.lower()
    found = []

    for vehicle in VEHICLES:
        if contains_keyword(text, vehicle):
            found.append(vehicle)

    return found


def extract_vehicle(text):
    vehicles = extract_vehicles(text)

    if vehicles:
        return vehicles[0]

    return "unknown"


def extract_colors(text):
    text = text.lower()
    found = []

    for color in COLORS:
        if contains_keyword(text, color):
            found.append(color)

    return found


def extract_color(text):
    colors = extract_colors(text)

    if colors:
        return colors[0]

    return "unknown"


def extract_weapons(text):
    text = text.lower()
    found = []

    for weapon in WEAPONS:
        if contains_keyword(text, weapon):
            found.append(weapon)

    return found


def extract_date(text):
    patterns = [
        r"\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b",
        r"\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{4}\b",
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            return match.group(0)

    return "unknown"


def extract_time(text):
    pattern = r"\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)\b"

    match = re.search(pattern, text)

    if match:
        return match.group(0)

    return "unknown"


def extract_location(text):
    patterns = [
        r"\b(?:near|at|in)\s+([A-Za-z][A-Za-z\s]*?),\s*([A-Za-z][A-Za-z\s]+)",
        r"\b(?:near|at|in)\s+([A-Za-z][A-Za-z\s]*?)(?=\s+(?:on|from|with|where|when|near|at|in)\b|[.,!?;]|$)"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            if match.lastindex == 2:
                return f"{match.group(1).strip()}, {match.group(2).strip()}"

            return match.group(1).strip()

    return "unknown"


def extract_suspects(text):
    patterns = [
        r"\b\d+\s+(?:unidentified|unknown)\s+(?:men|women|persons|people)\b",
        r"\btwo\s+(?:unidentified|unknown)\s+(?:men|women|persons|people)\b",
        r"\bthree\s+(?:unidentified|unknown)\s+(?:men|women|persons|people)\b",
        r"\bone\s+(?:unidentified|unknown)\s+(?:man|woman|person)\b"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            return match.group(0)

    return "unknown"


def extract_amount(text):
    patterns = [
        r"₹\s?\d+(?:\.\d+)?\s*(?:lakh|lakhs|crore|crores)?",
        r"\b\d+(?:\.\d+)?\s*(?:lakh|lakhs|crore|crores)\b",
        r"\b\d+(?:,\d{3})*(?:\.\d+)?\s*(?:rupees|rs)\b"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            return match.group(0)

    return "unknown"


def extract_target(text):
    patterns = [
        r"\b(?:robbed|burglarized|attacked)\s+(?:a|an|the)\s+([A-Za-z\s]+?)(?:\s+near|\s+in|\s+at|\.|,)",
        r"\b(?:robbed|burglarized|attacked)\s+(?:a|an|the)\s+([A-Za-z\s]+)"
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            return match.group(1).strip()

    return "unknown"


def extract_information(text):

    if not text or not text.strip():
        return {
            "crime_type": "unknown",
            "crime_types": [],
            "date": "unknown",
            "time": "unknown",
            "location": "unknown",
            "suspects": "unknown",
            "weapons": [],
            "vehicles": [],
            "colors": [],
            "amount": "unknown",
            "target": "unknown"
        }

    return {
        "crime_type": extract_crime_type(text),
        "crime_types": extract_crime_types(text),
        "date": extract_date(text),
        "time": extract_time(text),
        "location": extract_location(text),
        "suspects": extract_suspects(text),
        "weapons": extract_weapons(text),
        "vehicles": extract_vehicles(text),
        "colors": extract_colors(text),
        "amount": extract_amount(text),
        "target": extract_target(text)
    }


if __name__ == "__main__":

    text = input("Enter crime description: ")

    result = extract_information(text)

    print("\n=== Extracted Information ===")

    for key, value in result.items():
        print(f"{key}: {value}")