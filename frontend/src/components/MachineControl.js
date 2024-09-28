import React from 'react';

function MachineControl({ isRunning, onStart, onStop }) {
  return (
    <div className="module machine-control">
      <h2>Machine Control</h2>
      {isRunning ? (
        <button onClick={onStop}>Stop Chiller Plant</button>
      ) : (
        <button onClick={onStart}>Start Chiller Plant</button>
      )}
      <p>Status: {isRunning ? 'Running' : 'Stopped'}</p>
    </div>
  );
}

export default MachineControl;