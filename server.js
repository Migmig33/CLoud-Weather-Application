import express from "express";
import cors from "cors";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));


// === API KEYSSS ENCRYPTED === //
const AI_KEY = process.env.API_AI_KEY;
const WEATHER_KEY = process.env.WEATHER_API_KEY;

// === Setup AI === //
const genAI = new GoogleGenerativeAI(AI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: ` You are a helpful and friendly weather chatbot. 
     Always use the provided weather JSON data as reference. 
     If the user greets you (like 'hello', 'sup', 'kamusta', etc.), greet them back casually. 
     If the user speaks Tagalog, respond in Tagalog
     Explain the weather naturally — like you’re chatting with a friend. 
     Never make up data; use only what’s in the JSON. 
     If something is missing, just say it’s not available. 
    `,
});

// === Routes === //
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/chat", async (req, res) =>{
    try{
        const { message, latitude, longitude } = req.body;

        if(!message){
            return res.json({ error: "No Message Provided "});
        }

        if(!latitude || !longitude){
            return res.json({
                response: 
                "Sorry, i'm unable to detect your location. May unavailable or denied",
            });
        }

        const weather_data = await getWeatherByCoords(latitude, longitude);
        if (!weather_data){
            return res.json({
                response: 
                "Sorry, i'm unable to fetch weather data in your current location. Please Try Again Later.",
            });

        }
        const prompt = `User Message: ${message}
        Weather Data JSON:
        ${JSON.stringify(weather_data, null, 2)}
        `;


        const instruction = await model.generateContent(prompt);
        const reply = instruction.response.text();
        
        res.json({ response: reply });
      

} catch(err){
    console.log("Error: ", err);
    res.status(500).json({ error: err.message });
}
});



async function getWeatherByCoords(lat, lon){
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`;
    try{
        const res = await axios.get(url);
        return res.data;

    }catch(error){
        console.log("Weather API error: ", error.message);
        return null;
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`CLoudbot running on http://localhost:${PORT}`);
});
