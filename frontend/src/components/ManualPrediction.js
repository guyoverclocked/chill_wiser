import React, { useState } from 'react';

function ManualPrediction() {
  const [inputData, setInputData] = useState({
    CHWR: '',
    CHWS: '',
    GPM: '',
    'Temperature [C]': '',
    'RH [%]': '',
    WBT_C: '',
    Occupancy_rates: ''
  });
  const [predictionResult, setPredictionResult] = useState(null);

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      });
      const data = await response.json();
      setPredictionResult(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="module manual-prediction">
      <h2>Manual Prediction</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(inputData).map((key) => (
          <div key={key}>
            <label htmlFor={key}>{key}:</label>
            <input
              type="number"
              id={key}
              name={key}
              value={inputData[key]}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>
      {predictionResult && (
        <div className="prediction-result">
          <h3>Prediction Result:</h3>
          <p>Predicted Load: {predictionResult.prediction_results.predicted_load} kW</p>
          <p>Predicted RT: {predictionResult.prediction_results.predicted_rt} RT</p>
          <p>Predicted Efficiency: {predictionResult.prediction_results.predicted_efficiency}</p>
        </div>
      )}
    </div>
  );
}

export default ManualPrediction;