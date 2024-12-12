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

      setResult(data);
    } catch (err) {
      console.error("Error predicting sentiment:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Sentiment Analysis</h1>
      <textarea
        rows="5"
        cols="50"
        placeholder="Enter text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>Analyze Sentiment</button>
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Prediction Results</h2>
          <p>
            <strong>Sentiment:</strong> {result.predicted_sentiment}
          </p>
          <p>
            <strong>Negative:</strong> {result.negative.toFixed(2)}
          </p>
          <p>
            <strong>Neutral:</strong> {result.neutral.toFixed(2)}
          </p>
          <p>
            <strong>Positive:</strong> {result.positive.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
