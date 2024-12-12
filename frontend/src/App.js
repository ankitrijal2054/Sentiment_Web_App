import React, { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve Sentiment Score.");
      }

      setResult(data); // Update result with the response data
    } catch (err) {
      console.error("Error predicting sentiment:", err);
    }
  };

  // Helper to get the emoji for the predicted sentiment
  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "😊"; // Smiley face for positive sentiment
      case "neutral":
        return "😐"; // Neutral face for neutral sentiment
      case "negative":
        return "😞"; // Sad face for negative sentiment
      default:
        return "";
    }
  };

  const onInputTextChange = (text) => {
    setResult(null);
    setInputText(text);
  };

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ color: "#4CAF50" }}>Sentiment Analysis</h1>
        <textarea
          rows="5"
          cols="50"
          placeholder="Enter text here..."
          value={inputText}
          onChange={(e) => onInputTextChange(e.target.value)}
          style={{
            padding: "10px",
            border: "2px solid #4CAF50",
            borderRadius: "5px",
            fontSize: "16px",
            width: "80%",
          }}
        />
        <br />
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          disabled={!inputText}
        >
          Analyze Sentiment
        </button>
      </div>
      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "2px solid #4CAF50",
            borderRadius: "10px",
            display: "inline-block",
            textAlign: "left",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Prediction Results {getSentimentEmoji(result.predicted_sentiment)}
          </h2>
          <p>
            <strong>Sentiment:</strong> {result.predicted_sentiment}{" "}
            {getSentimentEmoji(result.predicted_sentiment)}
          </p>
          <p>
            <strong>Negative:</strong> {result.negative.toFixed(2) * 100}
            {"%"}
          </p>
          <p>
            <strong>Neutral:</strong> {result.neutral.toFixed(2) * 100}
            {"%"}
          </p>
          <p>
            <strong>Positive:</strong> {result.positive.toFixed(2) * 100}
            {"%"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
