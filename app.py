import mimetypes
mimetypes.init(files=[])

from flask import Flask, request, jsonify
import requests
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = "AIzaSyCI1kVtP4NN1mkfm5ulkQTlUJqb375vMus"
genai.configure(api_key=API_KEY)

WEATHER_API = "c3c80c25cd464567895155253250810"
model = genai.GenerativeModel("gemini-2.0-flash",
     system_instruction=
     "You are a helpful and friendly weather chatbot. "
     "Always use the provided weather JSON data as reference. "
     "If the user greets you (like 'hello', 'sup', 'kamusta', etc.), greet them back casually. "
     "If the user speaks Tagalog, respond in Tagalog"
     "Explain the weather naturally — like you’re chatting with a friend. "
     "Never make up data; use only what’s in the JSON. "
     "If something is missing, just say it’s not available. "
)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message= data.get('message')
        lat = data.get('latitude')
        lon = data.get('longitude')
        

        if not message:
            return jsonify({"error": "No Message Provided"})
        
        if lat and lon:
            weather_data = get_weather_by_coords(lat, lon)
        else:
            return jsonify({"response": "Sorry, I'm unable to detect your location. May unavailable or denied. "})
        if not weather_data:
             return jsonify({"response": "Sorry, I'm unable to fetch weather data"})
         
        chat = model.start_chat()
        response = chat.send_message(
            f"User Message{message}\n\nWeather Data JSON:\n{weather_data}"
        )
       

        return jsonify({"response": response.text})
           
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_weather_by_coords(lat, lon):
    url = f"https://api.weatherapi.com/v1/forecast.json?key={WEATHER_API}&q={lat},{lon}&days=3&aqi=no&alerts=no"
    res = requests.get(url)
    if res.status_code == 200:
        return res.json()
    return None


@app.route('/')
def home():
    return "CLoudBot is Running"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
