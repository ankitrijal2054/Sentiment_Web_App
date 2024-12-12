from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax

# Load RoBERTa model and tokenizer
MODEL = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

# Initialize Flask app
app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    user_input = data.get("text", "")
    
    # Tokenize and predict
    encoded_input = tokenizer(user_input, return_tensors="pt", padding=True, truncation=True)
    output = model(**encoded_input)
    scores = output.logits[0].detach().numpy()
    probabilities = softmax(scores)
    
    # Prepare response
    response = {
        "negative": probabilities[0],
        "neutral": probabilities[1],
        "positive": probabilities[2],
        "predicted_sentiment": ["negative", "neutral", "positive"][probabilities.argmax()]
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
