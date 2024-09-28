import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

function LiveGraphs({ data }) {
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('HH:mm:ss');
  };

  const variables = [
    { key: 'prediction_results.predicted_load', name: 'Predicted Load', color: '#8884d8' },
    { key: 'prediction_results.predicted_rt', name: 'Predicted RT', color: '#82ca9d' },
    { key: 'prediction_results.predicted_efficiency', name: 'Predicted Efficiency', color: '#ffc658' },
    { key: 'prediction_results.total_power', name: 'Total Power', color: '#ff7300' },
  ];

  return (
    <div className="live-graphs">
      <h2>Live Graphs</h2>
      <div className="graph-grid">
        {variables.map((variable) => (
          <div key={variable.key} className="graph-container">
            <h3>{variable.name}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxis}
                  type="category"
                  domain={['dataMin', 'dataMax']}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => moment(label).format('YYYY-MM-DD HH:mm:ss')}
                  formatter={(value) => [value.toFixed(2), variable.name]}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={variable.key} 
                  name={variable.name} 
                  stroke={variable.color}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveGraphs;