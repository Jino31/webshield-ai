import sys
import joblib
import pandas as pd
import ipaddress

from urllib.parse import urlparse
from scipy.sparse import hstack, csr_matrix


MODEL_PATH = "webshield_v2.joblib"


# ============================================================
# URL NORMALIZATION
# ============================================================

def normalize_url(url):
    url = str(url).strip().lower()

    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    return url


# ============================================================
# FEATURE EXTRACTION
# ============================================================

def extract_features(url):

    url = normalize_url(url)

    parsed = urlparse(url)

    hostname = parsed.hostname or ""
    hostname = hostname.rstrip(".")

    path = parsed.path or ""
    query = parsed.query or ""

    url_length = len(url)
    domain_length = len(hostname)

    digits = sum(c.isdigit() for c in url)
    letters = sum(c.isalpha() for c in url)

    special_chars = sum(
        not c.isalnum()
        for c in url
    )

    at_count = url.count("@")
    dash_count = url.count("-")
    underscore_count = url.count("_")
    dot_count = url.count(".")
    slash_count = url.count("/")
    question_count = url.count("?")
    equal_count = url.count("=")
    ampersand_count = url.count("&")
    percent_count = url.count("%")

    domain_parts = hostname.split(".") if hostname else []

    subdomain_count = max(
        len(domain_parts) - 2,
        0
    )

    # IP detection
    try:
        ipaddress.ip_address(hostname)
        is_ip = 1
    except ValueError:
        is_ip = 0

    # Suspicious words
    suspicious_words = [
        "login",
        "signin",
        "verify",
        "verification",
        "secure",
        "account",
        "update",
        "confirm",
        "password",
        "credential",
        "bank",
        "paypal",
        "wallet",
        "payment",
        "invoice",
        "billing",
        "support",
        "unlock",
        "suspend",
        "security",
        "authenticate",
        "webscr",
        "bonus",
        "free"
    ]

    suspicious_word_count = sum(
        1
        for word in suspicious_words
        if word in url
    )

    is_https = int(
        parsed.scheme == "https"
    )

    if url_length > 0:
        digit_ratio = digits / url_length
        letter_ratio = letters / url_length
        special_ratio = special_chars / url_length
    else:
        digit_ratio = 0
        letter_ratio = 0
        special_ratio = 0

    path_length = len(path)
    query_length = len(query)

    query_parameter_count = (
        query.count("&") + 1
        if query
        else 0
    )

    unique_chars = len(set(url))

    if url_length > 0:
        unique_char_ratio = (
            unique_chars / url_length
        )
    else:
        unique_char_ratio = 0

    return {
        "url_length": url_length,
        "domain_length": domain_length,
        "is_ip": is_ip,
        "is_https": is_https,
        "subdomain_count": subdomain_count,
        "digit_count": digits,
        "digit_ratio": digit_ratio,
        "letter_count": letters,
        "letter_ratio": letter_ratio,
        "special_char_count": special_chars,
        "special_ratio": special_ratio,
        "at_count": at_count,
        "dash_count": dash_count,
        "underscore_count": underscore_count,
        "dot_count": dot_count,
        "slash_count": slash_count,
        "question_count": question_count,
        "equal_count": equal_count,
        "ampersand_count": ampersand_count,
        "percent_count": percent_count,
        "suspicious_word_count": suspicious_word_count,
        "path_length": path_length,
        "query_length": query_length,
        "query_parameter_count": query_parameter_count,
        "unique_char_ratio": unique_char_ratio
    }


# ============================================================
# PREDICTION
# ============================================================

def predict_url(url):

    print()
    print("=" * 70)
    print("              WEBSHIELD AI v2")
    print("=" * 70)

    print("\nLoading model...")

    data = joblib.load(MODEL_PATH)

    model = data["model"]
    vectorizer = data["vectorizer"]
    scaler = data["scaler"]
    feature_names = data["feature_names"]

    normalized_url = normalize_url(url)

    # --------------------------------------------------------
    # TF-IDF
    # --------------------------------------------------------

    X_text = vectorizer.transform(
        [normalized_url]
    )

    # --------------------------------------------------------
    # Engineered features
    # --------------------------------------------------------

    features = extract_features(
        normalized_url
    )

    X_features = pd.DataFrame(
        [features]
    )[feature_names]

    X_numeric = scaler.transform(
        X_features
    )

    # --------------------------------------------------------
    # Combine
    # --------------------------------------------------------

    X = hstack([
        X_text,
        csr_matrix(X_numeric)
    ]).tocsr()

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    prediction = model.predict(X)[0]

    probabilities = model.predict_proba(X)[0]

    phishing_probability = probabilities[0]
    legitimate_probability = probabilities[1]

    if prediction == 0:
        result = "PHISHING"
        confidence = phishing_probability
    else:
        result = "LEGITIMATE"
        confidence = legitimate_probability

    print("\nURL:")
    print(url)

    print("\nPrediction:")
    print(result)

    print(
        f"Confidence: {confidence * 100:.2f}%"
    )

    print(
        f"\nPhishing probability: "
        f"{phishing_probability * 100:.2f}%"
    )

    print(
        f"Legitimate probability: "
        f"{legitimate_probability * 100:.2f}%"
    )

    print("\n" + "=" * 70)


# ============================================================
# COMMAND LINE
# ============================================================

if __name__ == "__main__":

    if len(sys.argv) < 2:

        print(
            'Usage: py predict.py "https://example.com"'
        )

        sys.exit(1)

    predict_url(
        sys.argv[1]
    )