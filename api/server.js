const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();

// Allow requests from your Vercel domain
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/server', async (req, res) => {
    const { userGuess } = req.body;

    if (!userGuess) {
        return res.status(400).json({ error: "No guess provided" });
    }

    const prompt = `The user thinks this website is about: "${userGuess}". 
    Generate a creative, interactive Bootstrap 5 HTML snippet that represents the EXACT OPPOSITE of that guess.
    Rules:
    1. Use modern Bootstrap 5 classes.
    2. Provide ONLY the HTML code inside a <div>. No markdown backticks, no explanations.
    3. Make it ironic or funny.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const htmlOutput = response.text();
        res.json({ html: htmlOutput });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "The AI is confused. Try again!" });
    }
});

// CRITICAL FOR VERCEL: Export the app
module.exports = app;
