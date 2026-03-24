const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini (Get your API key at aistudio.google.com)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/generate-opposite', async (req, res) => {
    const { userGuess } = req.body;

    const prompt = `The user thinks this website is about: "${userGuess}". 
    Generate a creative, interactive Bootstrap 5 HTML snippet that represents the EXACT OPPOSITE of that guess.
    Rules:
    1. Use modern Bootstrap 5 classes (cards, buttons, alerts, etc.).
    2. Provide ONLY the HTML code inside a <div>. No markdown backticks, no explanations.
    3. Make it funny or ironic. 
    4. Ensure it has at least one interactive element (like a button that does nothing or a fake form).`;

    try {
        const result = await model.generateContent(prompt);
        const htmlOutput = result.response.text();
        res.json({ html: htmlOutput });
    } catch (error) {
        res.status(500).json({ error: "LLM took a nap. Try again!" });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
