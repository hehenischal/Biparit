const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();

// Allow requests from your Vercel domain
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/api/server', async (req, res) => {
    const { userGuess } = req.body;

    if (!userGuess) {
        return res.status(400).json({ error: "No guess provided" });
    }

    const prompt = `The user thinks this website is about: "${userGuess}". 
    Generate a creative, interactive Bootstrap 5 HTML snippet that represents the OPPOSITE of that guess.
    Rules:
    1. Use modern Bootstrap 5 classes.
    2. Provide ONLY HTML,CSS,JS code to be replaced inside of Body tag(using InnerHTML). No markdown backticks, no explanations. Give code in such a way that the website looks great.
    3. Make it super serious looking. nothing too obviously fake. User should read the contents to be able to know that its a joke.
    4. Use CSS,JS or other things to make the website interactive. I am not doing any kind of sanitation & the website should feel modern. not just static garbage.
    5. You can make Rage Baity website if theres an opportunity to do so.`;

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
