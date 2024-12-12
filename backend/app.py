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
app = Flask(__name__, static_folder="frontend/build")  # Point to React's build folder
CORS(app)  # Enables CORS for all routes

@app.route('/')
def serve_index():
    """Serve the index.html file from the React build directory."""
    return send_from_directory(app.static_folder, "index.html")

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files like JS, CSS, images, etc., from the React build directory."""
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

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
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))