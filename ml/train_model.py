import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


def train():

    # --------------------------------------------------
    # 1. Paths
    # --------------------------------------------------

    dataset_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "dataset",
        "phishing_data.csv"
    )

    model_path = os.path.join(
        os.path.dirname(__file__),
        "phishing_model.joblib"
    )

    print("=" * 60)
    print("        WEBSHIELD AI - MODEL TRAINING")
    print("=" * 60)

    # --------------------------------------------------
    # 2. Check dataset
    # --------------------------------------------------

    if not os.path.exists(dataset_path):
        print("\nERROR: Dataset not found!")
        print(f"Expected location:\n{dataset_path}")
        return

    print("\n[1/7] Loading dataset...")

    df = pd.read_csv(dataset_path)

    print(f"Dataset loaded successfully.")
    print(f"Rows    : {df.shape[0]}")
    print(f"Columns : {df.shape[1]}")

    # --------------------------------------------------
    # 3. Check label
    # --------------------------------------------------

    if "label" not in df.columns:
        print("\nERROR: 'label' column not found!")
        print("Available columns:")
        print(df.columns.tolist())
        return

    print("\n[2/7] Checking labels...")

    print("\nLabel distribution:")
    print(df["label"].value_counts())

    # --------------------------------------------------
    # 4. Remove missing values
    # --------------------------------------------------

    print("\n[3/7] Checking missing values...")

    missing = df.isnull().sum().sum()

    print(f"Total missing values: {missing}")

    if missing > 0:
        print("Removing rows containing missing values...")
        df = df.dropna()

    # --------------------------------------------------
    # 5. Prepare X and y
    # --------------------------------------------------

    print("\n[4/7] Preparing features...")

    X = df.drop(columns=["label"])
    y = df["label"]

    # Keep only numerical features
    non_numeric = X.select_dtypes(
        exclude=["number"]
    ).columns.tolist()

    if non_numeric:
        print("\nNon-numeric columns found:")
        print(non_numeric)

        print("\nRemoving non-numeric columns for this model...")
        X = X.drop(columns=non_numeric)

    print(f"\nFeatures used: {X.shape[1]}")

    print("\nFeature columns:")
    for column in X.columns:
        print(f" - {column}")

    # --------------------------------------------------
    # 6. Train/Test split
    # --------------------------------------------------

    print("\n[5/7] Splitting dataset...")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    print(f"Training samples : {len(X_train)}")
    print(f"Testing samples  : {len(X_test)}")

    # --------------------------------------------------
    # 7. Train Random Forest
    # --------------------------------------------------

    print("\n[6/7] Training Random Forest...")
    print("Please wait...")

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    print("Training completed!")

    # --------------------------------------------------
    # 8. Evaluation
    # --------------------------------------------------

    print("\n[7/7] Evaluating model...")

    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print("\n" + "=" * 60)
    print("                 MODEL RESULTS")
    print("=" * 60)

    print(f"\nAccuracy: {accuracy * 100:.2f}%")

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            predictions
        )
    )

    print("Confusion Matrix:")
    print(
        confusion_matrix(
            y_test,
            predictions
        )
    )

    # --------------------------------------------------
    # 9. Save model
    # --------------------------------------------------

    joblib.dump(
        model,
        model_path
    )

    print("\n" + "=" * 60)
    print("MODEL SAVED SUCCESSFULLY")
    print("=" * 60)

    print(f"\nLocation:")
    print(model_path)

    print("\nWebShield AI training finished!")


if __name__ == "__main__":
    train()