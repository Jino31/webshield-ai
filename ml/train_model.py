"""
WebShield AI v2
URL Text + Engineered Feature Phishing Detector

Training strategy:
- Uses raw URL character n-grams
- Uses engineered URL/domain features
- Removes duplicate URLs
- Uses domain-based train/test split
- Prevents domain leakage
"""

import os
import re
import joblib
import numpy as np
import pandas as pd

from urllib.parse import urlparse
from sklearn.model_selection import GroupShuffleSplit
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)
from scipy.sparse import hstack, csr_matrix


# ============================================================
# CONFIGURATION
# ============================================================

DATASET_PATH = "../dataset/PhiUSIIL_Phishing_URL_Dataset.csv"
MODEL_PATH = "webshield_v2.joblib"

RANDOM_STATE = 42


# ============================================================
# URL CLEANING
# ============================================================

def normalize_url(url):
    """
    Normalize URL only for model text representation.
    We do NOT remove meaningful URL structure.
    """

    url = str(url).strip().lower()

    if not url.startswith(("http://", "https://")):
        url = "http://" + url

    return url


# ============================================================
# ENGINEERED FEATURES
# ============================================================

def extract_features(url):
    """
    Extract features that can also be calculated
    for a live URL.
    """

    url = normalize_url(url)

    parsed = urlparse(url)

    hostname = parsed.hostname or ""

    # Remove possible trailing dot
    hostname = hostname.rstrip(".")

    path = parsed.path or ""
    query = parsed.query or ""

    # --------------------------------------------------------
    # Basic URL features
    # --------------------------------------------------------

    url_length = len(url)

    domain_length = len(hostname)

    digits = sum(c.isdigit() for c in url)

    letters = sum(c.isalpha() for c in url)

    special_chars = sum(
        not c.isalnum()
        for c in url
    )

    # --------------------------------------------------------
    # Suspicious characters
    # --------------------------------------------------------

    at_count = url.count("@")
    dash_count = url.count("-")
    underscore_count = url.count("_")
    dot_count = url.count(".")
    slash_count = url.count("/")
    question_count = url.count("?")
    equal_count = url.count("=")
    ampersand_count = url.count("&")
    percent_count = url.count("%")

    # --------------------------------------------------------
    # Domain structure
    # --------------------------------------------------------

    domain_parts = hostname.split(".") if hostname else []

    subdomain_count = max(len(domain_parts) - 2, 0)

    # --------------------------------------------------------
    # IP detection
    # --------------------------------------------------------

    is_ip = 0

    try:
        import ipaddress

        ipaddress.ip_address(hostname)
        is_ip = 1

    except ValueError:
        is_ip = 0

    # --------------------------------------------------------
    # Suspicious words
    # --------------------------------------------------------

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
        1 for word in suspicious_words
        if word in url
    )

    # --------------------------------------------------------
    # HTTPS
    # --------------------------------------------------------

    is_https = int(parsed.scheme == "https")

    # --------------------------------------------------------
    # Ratios
    # --------------------------------------------------------

    if url_length > 0:
        digit_ratio = digits / url_length
        letter_ratio = letters / url_length
        special_ratio = special_chars / url_length
    else:
        digit_ratio = 0
        letter_ratio = 0
        special_ratio = 0

    # --------------------------------------------------------
    # Path/query features
    # --------------------------------------------------------

    path_length = len(path)

    query_length = len(query)

    query_parameter_count = (
        query.count("&") + 1
        if query
        else 0
    )

    # --------------------------------------------------------
    # Character repetition / entropy-like features
    # --------------------------------------------------------

    unique_chars = len(set(url))

    if url_length > 0:
        unique_char_ratio = unique_chars / url_length
    else:
        unique_char_ratio = 0

    # --------------------------------------------------------
    # Build feature dictionary
    # --------------------------------------------------------

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
# MAIN TRAINING
# ============================================================

print("=" * 70)
print("       WEBSHIELD AI v2 - URL TEXT + FEATURES")
print("=" * 70)


# ============================================================
# 1. LOAD DATASET
# ============================================================

print("\n[1/9] Loading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Rows: {len(df):,}")
print(f"Columns: {len(df.columns)}")


# ============================================================
# 2. CLEAN DATA
# ============================================================

print("\n[2/9] Cleaning dataset...")

df = df.dropna(subset=["URL", "label", "Domain"])

df["URL"] = df["URL"].astype(str)
df["Domain"] = df["Domain"].astype(str)

before = len(df)

df = df.drop_duplicates(
    subset=["URL"]
).reset_index(drop=True)

removed = before - len(df)

print(f"Duplicate URLs removed: {removed:,}")
print(f"Remaining URLs: {len(df):,}")


# ============================================================
# 3. DOMAIN-BASED SPLIT
# ============================================================

print("\n[3/9] Creating domain-based train/test split...")

groups = df["Domain"]

splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=RANDOM_STATE
)

train_idx, test_idx = next(
    splitter.split(
        df,
        df["label"],
        groups=groups
    )
)

train_df = df.iloc[train_idx].copy()
test_df = df.iloc[test_idx].copy()

train_domains = set(train_df["Domain"])
test_domains = set(test_df["Domain"])

overlap = train_domains.intersection(test_domains)

print(f"Training samples: {len(train_df):,}")
print(f"Testing samples:  {len(test_df):,}")
print(f"Training domains: {len(train_domains):,}")
print(f"Testing domains:  {len(test_domains):,}")
print(f"Domain overlap:   {len(overlap)}")

if len(overlap) != 0:
    raise RuntimeError(
        "Domain leakage detected!"
    )

print("Domain leakage check: PASSED")


# ============================================================
# 4. EXTRACT ENGINEERED FEATURES
# ============================================================

print("\n[4/9] Extracting engineered URL features...")


def build_feature_dataframe(urls):

    rows = []

    total = len(urls)

    for i, url in enumerate(urls):

        rows.append(
            extract_features(url)
        )

        if (i + 1) % 10000 == 0:
            print(
                f"Processed {i + 1:,} / {total:,}"
            )

    return pd.DataFrame(rows)


X_train_features = build_feature_dataframe(
    train_df["URL"].tolist()
)

X_test_features = build_feature_dataframe(
    test_df["URL"].tolist()
)

print(
    f"Engineered features: "
    f"{X_train_features.shape[1]}"
)


# ============================================================
# 5. TF-IDF CHARACTER FEATURES
# ============================================================

print("\n[5/9] Training URL character TF-IDF...")

train_urls = [
    normalize_url(u)
    for u in train_df["URL"]
]

test_urls = [
    normalize_url(u)
    for u in test_df["URL"]
]

vectorizer = TfidfVectorizer(
    analyzer="char",
    ngram_range=(2, 5),
    min_df=3,
    max_features=150000,
    sublinear_tf=True
)

X_train_text = vectorizer.fit_transform(
    train_urls
)

X_test_text = vectorizer.transform(
    test_urls
)

print(
    f"TF-IDF features: "
    f"{X_train_text.shape[1]:,}"
)


# ============================================================
# 6. COMBINE FEATURES
# ============================================================

print("\n[6/9] Combining URL text + engineered features...")

feature_scaler = StandardScaler()

X_train_numeric = feature_scaler.fit_transform(
    X_train_features
)

X_test_numeric = feature_scaler.transform(
    X_test_features
)

X_train = hstack([
    X_train_text,
    csr_matrix(X_train_numeric)
]).tocsr()

X_test = hstack([
    X_test_text,
    csr_matrix(X_test_numeric)
]).tocsr()

y_train = train_df["label"].values
y_test = test_df["label"].values

print(
    f"Final training matrix: "
    f"{X_train.shape}"
)

print(
    f"Final testing matrix: "
    f"{X_test.shape}"
)


# ============================================================
# 7. TRAIN CLASSIFIER
# ============================================================

print("\n[7/9] Training classifier...")

model = RandomForestClassifier(
    n_estimators=300,
    random_state=RANDOM_STATE,
    n_jobs=-1,
    class_weight="balanced",
    max_features="sqrt"
)

model.fit(
    X_train,
    y_train
)

print("Training completed!")


# ============================================================
# 8. EVALUATION
# ============================================================

print("\n[8/9] Evaluating model...")

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

phishing_precision = precision_score(
    y_test,
    predictions,
    pos_label=0,
    zero_division=0
)

phishing_recall = recall_score(
    y_test,
    predictions,
    pos_label=0,
    zero_division=0
)

phishing_f1 = f1_score(
    y_test,
    predictions,
    pos_label=0,
    zero_division=0
)


print("\n" + "=" * 70)
print("                    MODEL RESULTS")
print("=" * 70)

print(
    f"\nAccuracy:            {accuracy * 100:.2f}%"
)

print(
    f"Phishing Precision:  {phishing_precision * 100:.2f}%"
)

print(
    f"Phishing Recall:     {phishing_recall * 100:.2f}%"
)

print(
    f"Phishing F1:         {phishing_f1 * 100:.2f}%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        target_names=[
            "Phishing",
            "Legitimate"
        ],
        zero_division=0
    )
)

print("Confusion Matrix:")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


# ============================================================
# 9. SAVE MODEL
# ============================================================

print("\n[9/9] Saving WebShield AI v2...")

model_data = {
    "model": model,
    "vectorizer": vectorizer,
    "scaler": feature_scaler,
    "feature_names": list(
        X_train_features.columns
    ),
    "label_mapping": {
        0: "phishing",
        1: "legitimate"
    }
}

joblib.dump(
    model_data,
    MODEL_PATH
)

print("\n" + "=" * 70)
print("MODEL SAVED SUCCESSFULLY")
print("=" * 70)

print(
    f"\nSaved to:\n"
    f"{os.path.abspath(MODEL_PATH)}"
)

print("\nWebShield AI v2 training finished.")