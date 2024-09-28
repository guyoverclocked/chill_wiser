# Chiller Prediction System

## Description

The Chiller Prediction System is a web-based application designed to monitor, predict, and optimize the performance of chiller plants. It uses machine learning models to predict various parameters of chiller operation and provides real-time recommendations for efficiency improvements.

## Features

- Real-time monitoring of chiller plant performance
- Machine learning-based predictions for chiller load, efficiency, and power consumption
- Live graphical representation of key performance indicators
- Manual prediction input for what-if scenarios
- Automated recommendations for optimizing chiller plant operation
- User-friendly interface for both machine view and manual prediction

## Technology Stack

- Frontend: React.js
- Backend: Flask (Python)
- Machine Learning: Scikit-learn (joblib for model serialization)
- Real-time Communication: Socket.IO
- Data Visualization: Recharts

## Installation

### Prerequisites

- Node.js and npm
- Python 3.7+
- pip

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install required Python packages:
   ```
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```
   python app.py
   ```

## Usage

1. Start both the frontend and backend servers as described in the installation steps.
2. Open a web browser and navigate to `http://localhost:3000`.
3. Use the "Machine View" to start/stop the chiller plant simulation and view real-time predictions and recommendations.
4. Switch to "Manual Prediction" to input custom values and get predictions.

## Project Structure

- `frontend/`: Contains all React components and frontend logic
  - `src/`: Source files for React components
  - `public/`: Public assets and index.html
- `backend/`: Contains Flask server and machine learning model
  - `app.py`: Main Flask application
  - `chiller_predictor_v2.joblib`: Serialized machine learning model

## Contributing

Contributions to the Chiller Prediction System are welcome. Please ensure to follow the existing code style and add unit tests for any new features.

## License

This project is licensed under the MIT License.