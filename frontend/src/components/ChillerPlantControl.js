import React from 'react';

function ChillerPlantControl({ isRunning, onStart, onStop }) {
  return (
    <div className="chiller-plant-control">
      <h2>Chiller Plant Control</h2>
      {isRunning ? (
        <button onClick={onStop}>Stop Chiller Plant</button>
      ) : (
        <button onClick={onStart}>Start Chiller Plant</button>
      )}
      <p>Status: {isRunning ? 'Running' : 'Stopped'}</p>
    </div>
  );
}

export default ChillerPlantControl;