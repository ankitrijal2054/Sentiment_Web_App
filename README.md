# Sentiment Analysis Web App

This project is a simple Sentiment Analysis Web Application built using React.js for the frontend and Flask for the backend. It uses a pre-trained RoBERTa model from Hugging Face's Transformers library to analyze the sentiment of user-provided text.

## Features

- Analyze text to predict sentiment: **Positive**, **Neutral**, or **Negative**.
- Displays the sentiment along with a breakdown of probabilities for each class.
- Interactive and user-friendly UI with real-time updates.
- Responsive design with hover effects and visual enhancements.
- Backend powered by Flask, with Flask-CORS enabled for cross-origin requests.
- Pre-trained RoBERTa model for accurate sentiment predictions.

## Technologies Used

### Frontend
- **React.js**: Frontend framework for creating the user interface.
- **CSS**: Styled components for UI design.

### Backend
- **Flask**: Lightweight Python web framework for handling API requests.
- **Flask-CORS**: Middleware to allow cross-origin requests.
- **Transformers**: Hugging Face library for loading and using the RoBERTa sentiment model.
- **scipy**: For computing softmax scores.
