from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import csv
import time
from threading import Thread
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

# Load the trained model
model = joblib.load('chiller_predictor_v2.joblib')

# Define the expected feature names in the correct order
feature_names = model.estimators_[0].feature_names_in_

# Global variables
chiller_plant_running = False
current_row = 0

def process_csv_data():
    global current_row, chiller_plant_running
    with open('Chiller plant.csv', 'r') as file:
        csv_reader = csv.DictReader(file)
        data = list(csv_reader)
        
    while chiller_plant_running:
        if current_row >= len(data):
            current_row = 0
        
        row = data[current_row]
        input_data = {
            'CHWR': float(row['CHWR']),
            'CHWS': float(row['CHWS']),
            'GPM': float(row['GPM']),
            'Temperature [C]': float(row['Temperature [C]']),
            'RH [%]': float(row['RH [%]']),
            'WBT_C': float(row['WBT_C']),
            'Occupancy_rates': float(row['Occupancy_rates'])
        }
        
        make_prediction_and_send(input_data)
        
        current_row += 1
        time.sleep(5)

def make_prediction_and_send(input_data):
    for feature in feature_names:
        if feature not in input_data:
            return {"error": f"Missing feature: {feature}"}, 400

    # Convert input to DataFrame, ensuring correct order of features
    input_df = pd.DataFrame([input_data])[feature_names]

    # Make predictions
    predictions = model.predict(input_df)

    # Define targets
    targets = ['CH Load', 'RT', 'kW_RT', 'Hz_ CHP', 'Hz_CHS', 'Hz_CDS', 'Hz_CT']

    # Process predictions
    ch_load = predictions[0, targets.index('CH Load')]
    rt = predictions[0, targets.index('RT')]
    kw_rt = predictions[0, targets.index('kW_RT')]
    hz_chp = predictions[0, targets.index('Hz_ CHP')]
    hz_chs = predictions[0, targets.index('Hz_CHS')]
    hz_cds = predictions[0, targets.index('Hz_CDS')]
    hz_ct = predictions[0, targets.index('Hz_CT')]

    # Calculate efficiency (kW/RT)
    efficiency = kw_rt
    
    adjusted_efficiency = efficiency

    total_power = kw_rt * rt

    # Prepare the response
    response = {
        "prediction_results": {
            "predicted_load": round(ch_load, 2),
            "predicted_rt": round(rt, 2),
            "predicted_efficiency": round(adjusted_efficiency, 2),
            "total_power": round(total_power, 2)
        },
        "equipment_adjustments": {
            "primary_chilled_water_pump": {
                "hz": round(hz_chp, 2),
                "percentage": round(hz_chp/60*100, 2)
            },
            "secondary_chilled_water_pump": {
                "hz": round(hz_chs, 2)
            },
            "condenser_water_pump": {
                "hz": round(hz_cds, 2),
                "percentage": round(hz_cds/60*100, 2)
            },
            "cooling_tower_fan": {
                "hz": round(hz_ct, 2),
                "percentage": round(hz_ct/60*100, 2)
            }
        },
        "recommendations": []
    }

    # Generate recommendations
    if ch_load < 30:
        response["recommendations"].append("Consider shutting down one of the chillers if multiple are running.")
    elif 30 <= ch_load < 60:
        response["recommendations"].append("Current chiller load is moderate. Monitor for potential optimization.")
    else:
        response["recommendations"].append("High chiller load. Ensure all necessary chillers are operational.")

    if adjusted_efficiency > 0.9:
        response["recommendations"].append("System efficiency is good. Maintain current settings.")
    elif 0.8 <= adjusted_efficiency <= 0.9:
        response["recommendations"].append("Consider fine-tuning chiller settings to improve efficiency.")
    else:
        response["recommendations"].append("System efficiency is low. Investigate potential issues and optimize settings.")

    chws = input_data['CHWS']
    if chws < 44:
        response["recommendations"].append(f"Current CHWS temperature ({chws:.1f}°C) is low. Consider increasing by 1-2°C to reduce energy consumption.")
    elif chws > 46:
        response["recommendations"].append(f"Current CHWS temperature ({chws:.1f}°C) is high. Consider decreasing if cooling demand is not met.")

    if hz_chp < 30:
        response["recommendations"].append("Primary Chilled Water Pump speed is low. Check if flow rate is sufficient.")
    elif hz_chp > 50:
        response["recommendations"].append("Primary Chilled Water Pump speed is high. Consider optimizing flow rate.")

    if hz_ct < 30:
        response["recommendations"].append("Cooling Tower Fan speed is low. Ensure it's sufficient for heat rejection.")
    elif hz_ct > 50:
        response["recommendations"].append("Cooling Tower Fan speed is high. Check condenser water temperature and optimize if possible.")

    occupancy = input_data['Occupancy_rates']
    if occupancy < 0.5:
        response["recommendations"].append("Low occupancy detected. Consider adjusting chiller capacity and air handling units accordingly.")

    if ch_load < 50:
        response["recommendations"].extend([
            "Consider shutting down one of the chillers if multiple are running.",
            "Increase chilled water supply temperature setpoint by 1-2°C to reduce energy consumption."
        ])
    elif 50 <= ch_load < 75:
        response["recommendations"].extend([
            "Optimize chiller sequencing to ensure chillers are running at their most efficient points.",
            "Monitor and adjust condenser water temperature for optimal efficiency."
        ])
    else:
        response["recommendations"].extend([
            "Ensure all auxiliary equipment (pumps, cooling towers) are running at full capacity.",
            "Consider load shedding or precooling strategies during peak demand periods."
        ])

    response["recommendations"].append("Note: These recommendations are based on general guidelines. Always consult with a professional engineer before making significant changes.")

    # Emit the response to connected clients
    socketio.emit('prediction_update', response)

    return response

@app.route('/predict', methods=['POST'])
def predict():
    input_data = request.json
    response = make_prediction_and_send(input_data)
    return jsonify(response)

@app.route('/start_chiller_plant', methods=['POST'])
def start_chiller_plant():
    global chiller_plant_running
    if not chiller_plant_running:
        chiller_plant_running = True
        Thread(target=process_csv_data).start()
    return jsonify({"status": "Chiller plant started"})

@app.route('/stop_chiller_plant', methods=['POST'])
def stop_chiller_plant():
    global chiller_plant_running
    chiller_plant_running = False
    return jsonify({"status": "Chiller plant stopped"})

if __name__ == '__main__':
    socketio.run(app, debug=True)