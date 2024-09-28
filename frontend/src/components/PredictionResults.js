import React from 'react';

function PredictionResults({ results, equipmentAdjustments }) {
  return (
    <div className="module prediction-results">
      <h2>Prediction Results</h2>
      <div>
        <h3>Chiller Performance</h3>
        <ul>
          <li>Predicted Load: {results.predicted_load.toFixed(2)} kW</li>
          <li>Predicted RT: {results.predicted_rt.toFixed(2)} RT</li>
          <li>Predicted Efficiency: {results.predicted_efficiency.toFixed(2)}</li>
          <li>Total Power: {results.total_power.toFixed(2)} kW</li>
        </ul>
      </div>
      <div>
        <h3>Equipment Adjustments</h3>
        <ul>
          <li>Primary Chilled Water Pump: {equipmentAdjustments.primary_chilled_water_pump.hz.toFixed(2)} Hz ({equipmentAdjustments.primary_chilled_water_pump.percentage.toFixed(2)}%)</li>
          <li>Secondary Chilled Water Pump: {equipmentAdjustments.secondary_chilled_water_pump.hz.toFixed(2)} Hz</li>
          <li>Condenser Water Pump: {equipmentAdjustments.condenser_water_pump.hz.toFixed(2)} Hz ({equipmentAdjustments.condenser_water_pump.percentage.toFixed(2)}%)</li>
          <li>Cooling Tower Fan: {equipmentAdjustments.cooling_tower_fan.hz.toFixed(2)} Hz ({equipmentAdjustments.cooling_tower_fan.percentage.toFixed(2)}%)</li>
        </ul>
      </div>
    </div>
  );
}

export default PredictionResults;