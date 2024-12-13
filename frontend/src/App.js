import React, { useState } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://sentiment-analysis-455b.onrender.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to retrieve Sentiment Score.");
      }

      setResult(data);
    } catch (err) {
      console.error("Error predicting sentiment:", err);
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "😊";
      case "neutral":
        return "😐";
      case "negative":
        return "😞";
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
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ textAlign: "center" }}>
        <div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <header
              style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
            >
              <h1 style={{ color: "#4CAF50" }}>Sentiment Analysis</h1>
            </header>

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
                backgroundColor: inputText ? "#4CAF50" : "#ccc",
                color: inputText ? "#fff" : "#666",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: inputText ? "pointer" : "not-allowed",
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
                Prediction Results{" "}
                {getSentimentEmoji(result.predicted_sentiment)}
              </h2>
              <p>
                <strong>Sentiment:</strong> {result.predicted_sentiment}{" "}
                {getSentimentEmoji(result.predicted_sentiment)}
              </p>
              <p>
                <strong>Negative:</strong> {(result.negative * 100).toFixed(2)}%
              </p>
              <p>
                <strong>Neutral:</strong> {(result.neutral * 100).toFixed(2)}%
              </p>
              <p>
                <strong>Positive:</strong> {(result.positive * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
      </div>

      <footer
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
        }}
      >
        <a
          href="https://github.com/ankitrijal2054/Sentiment_Web_App"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "#4CAF50" }}
        >
          Created by Ankit Rijal
        </a>
      </footer>
    </div>
  );
}

export default App;
