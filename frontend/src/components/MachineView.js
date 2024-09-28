import React from 'react';
import MachineControl from './MachineControl';
import LiveGraphs from './LiveGraphs';
import PredictionResults from './PredictionResults';
import Recommendations from './Recommendations';

function MachineView({ isRunning, onStart, onStop, predictionData, historicalData }) {
  return (
    <div className="machine-view">
      <div className="top-row">
        <MachineControl isRunning={isRunning} onStart={onStart} onStop={onStop} />
        {predictionData && (
          <PredictionResults
            results={predictionData.prediction_results}
            equipmentAdjustments={predictionData.equipment_adjustments}
          />
        )}
      </div>
      <LiveGraphs data={historicalData} />
      {predictionData && (
        <div className="recommendations-container">
          <Recommendations recommendations={predictionData.recommendations} />
        </div>
      )}
    </div>
  );
}

export default MachineView;