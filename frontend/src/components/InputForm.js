import React, { useState } from 'react';

function InputForm({ onSubmit }) {
  const [inputData, setInputData] = useState({
    CHWR: 0,
    CHWS: 0,
    GPM: 0,
    'Temperature [C]': 0,
    'RH [%]': 0,
    WBT_C: 0,
    Occupancy_rates: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData(prevData => ({
      ...prevData,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="CHWR">CHWR:</label>
        <input
          type="number"
          id="CHWR"
          name="CHWR"
          value={inputData.CHWR}
          onChange={handleChange}
          step="0.1"
        />
      </div>
      <div>
        <label htmlFor="CHWS">CHWS:</label>
        <input
          type="number"
          id="CHWS"
          name="CHWS"
          value={inputData.CHWS}
          onChange={handleChange}
          step="0.1"
        />
      </div>
      <div>
        <label htmlFor="GPM">GPM:</label>
        <input
          type="number"
          id="GPM"
          name="GPM"
          value={inputData.GPM}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="Temperature [C]">Temperature [C]:</label>
        <input
          type="number"
          id="Temperature [C]"
          name="Temperature [C]"
          value={inputData['Temperature [C]']}
          onChange={handleChange}
          step="0.1"
        />
      </div>
      <div>
        <label htmlFor="RH [%]">RH [%]:</label>
        <input
          type="number"
          id="RH [%]"
          name="RH [%]"
          value={inputData['RH [%]']}
          onChange={handleChange}
          step="0.1"
        />
      </div>
      <div>
        <label htmlFor="WBT_C">WBT_C:</label>
        <input
          type="number"
          id="WBT_C"
          name="WBT_C"
          value={inputData.WBT_C}
          onChange={handleChange}
          step="0.1"
        />
      </div>
      <div>
        <label htmlFor="Occupancy_rates">Occupancy Rates:</label>
        <input
          type="number"
          id="Occupancy_rates"
          name="Occupancy_rates"
          value={inputData.Occupancy_rates}
          onChange={handleChange}
          step="0.01"
          min="0"
          max="1"
        />
      </div>
      <button type="submit">Predict</button>
    </form>
  );
}

export default InputForm;