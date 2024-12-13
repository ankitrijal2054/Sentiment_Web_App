from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
import os

# Load the RoBERTa model and tokenizer once during initialization
MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

# Initialize Flask app
app = Flask( __name__ )

CORS(app)  # Enables CORS for all routes

@app.route('/')
def home():
    return "Backend is live!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Parse JSON request body
        data = request.get_json()
        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field in the request body"}), 400

        user_input = data["text"]

        # Tokenize and predict
        encoded_input = tokenizer(user_input, return_tensors="pt", padding=True, truncation=True)
        output = model(**encoded_input)
        scores = output.logits[0].detach().numpy()
        probabilities = softmax(scores)

        # Prepare response
        response = {
            "negative": float(probabilities[0]),
            "neutral": float(probabilities[1]),
            "positive": float(probabilities[2]),
            "predicted_sentiment": ["negative", "neutral", "positive"][probabilities.argmax()]
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5001)))