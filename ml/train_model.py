import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def train():
    dataset_path = os.path.join("..", "dataset", "phishing_data.csv")
    model_dir = os.path.dirname(__file__)
    model_path = os.path.join(model_dir, "phishing_model.joblib")
    
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        return

    # Load real-world structured dataset
    df = pd.read_csv(dataset_path)
    X = df.drop(columns=["label"])
    y = df["label"]

    # Split into training and testing sets for proper evaluation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize and train Random Forest Classifier
    model = RandomForestClassifier(n_estimators=150, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate model performance
    predictions = model.predict(X_test)
    acc = accuracy_score(y_test, predictions)
    print(f"Model Training Complete! Test Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, predictions))

    # Save the trained model artifact
    joblib.dump(model, model_path)
    print(f"Trained model saved successfully to: {model_path}")

if __name__ == "__main__":
    train()