import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import MachineView from './components/MachineView';
import ManualPrediction from './components/ManualPrediction';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isChillerPlantRunning, setIsChillerPlantRunning] = useState(false);
  const [activeView, setActiveView] = useState('machine');

  useEffect(() => {
    socket.on('prediction_update', (data) => {
      setPredictionData(data);
      setHistoricalData(prevData => [...prevData, { ...data, timestamp: new Date() }]);
    });

    return () => {
      socket.off('prediction_update');
    };
  }, []);

  const startChillerPlant = async () => {
    try {
      await fetch('http://localhost:5000/start_chiller_plant', { method: 'POST' });
      setIsChillerPlantRunning(true);
    } catch (error) {
      console.error('Error starting chiller plant:', error);
    }
  };

  const stopChillerPlant = async () => {
    try {
      await fetch('http://localhost:5000/stop_chiller_plant', { method: 'POST' });
      setIsChillerPlantRunning(false);
    } catch (error) {
      console.error('Error stopping chiller plant:', error);
    }
  };

  return (
    <div className="App">
      <h1>Chiller Prediction System</h1>
      <div className="header-buttons">
        <button onClick={() => setActiveView('machine')} className={activeView === 'machine' ? 'active' : ''}>
          Machine View
        </button>
        <button onClick={() => setActiveView('manual')} className={activeView === 'manual' ? 'active' : ''}>
          Manual Prediction
        </button>
      </div>
      {activeView === 'machine' ? (
        <MachineView
          isRunning={isChillerPlantRunning}
          onStart={startChillerPlant}
          onStop={stopChillerPlant}
          predictionData={predictionData}
          historicalData={historicalData}
        />
      ) : (
        <ManualPrediction />
      )}
    </div>
  );
}

export default App;