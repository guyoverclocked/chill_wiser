import React from 'react';

function Recommendations({ recommendations }) {
  return (
    <div className="module recommendations">
      <h2>Recommendations</h2>
      <ul>
        {recommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;