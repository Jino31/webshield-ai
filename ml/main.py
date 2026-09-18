import os
import re
import urllib.parse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Fake Website Detection ML API", version="1.0")

# Enable CORS for communication with your backend/frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model artifact
model_dir = os.path.dirname(__file__)
model_path = os.path.join(model_dir, "phishing_model.joblib")

model = None
if os.path.exists(model_path):
    model = joblib.load(model_path)
    print("Trained phishing detection model loaded successfully!")
else:
    print("Warning: Model file not found. Run train_model.py first.")

class URLRequest(BaseModel):
    url: str

def extract_features(url: str):
    """Extracts lexical features matching the dataset format."""
    parsed_url = urllib.parse.urlparse(url)
    hostname = parsed_url.hostname or ""
    path = parsed_url.path or ""
    
    url_length = len(url)
    has_ip = 1 if re.search(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', hostname) else 0
    count_dots = url.count('.')
    count_hyphens = hostname.count('-')
    has_at_symbol = 1 if '@' in url else 0
    is_https = 1 if parsed_url.scheme == 'https' else 0
    
    # Must match the column order used in training
    return [[url_length, has_ip, count_dots, count_hyphens, has_at_symbol, is_https]]

@app.post("/predict")
def predict_url(data: URLRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded on the server.")
    
    url = data.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
        
    try:
        features = extract_features(url)
        feature_columns = ["url_length", "has_ip", "count_dots", "count_hyphens", "has_at_symbol", "is_https"]
        input_df = pd.DataFrame(features, columns=feature_columns)
        
        # Predict using the Random Forest model
        prediction = int(model.predict(input_df)[0])
        probabilities = model.predict_proba(input_df)[0]
        
        # Confidence score for the predicted class
        confidence = float(probabilities[prediction]) * 100
        label = "Phishing / Fake" if prediction == 1 else "Safe"
        
        return {
            "url": url,
            "status": label,
            "prediction_code": prediction,
            "confidence_score": round(confidence, 2),
            "features_analyzed": {
                "url_length": features[0][0],
                "has_ip_address": bool(features[0][1]),
                "dot_count": features[0][2],
                "hyphen_count": features[0][3],
                "has_at_symbol": bool(features[0][4]),
                "is_https": bool(features[0][5])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "Fake Website Detection ML Microservice is active."}