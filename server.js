require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { 
                                text: `
        You are a virtual assistant for Sushanth furniture company, a furniture e-commerce platform. Your job is to assist customers with:
        1. Orders & Payments (how to place orders, accepted payment methods, modifying/canceling orders).
        2. Shipping & Delivery (shipping timelines, tracking orders, delivery areas).
        3. Returns & Refunds (return policies, refund process, exchanges).
        4. Product & Warranty (materials, warranty details, customization).
        5. Assembly & Installation (free & professional installation).
        6. Customer Support (contact info, issue resolution).
        
        **Rules:**
        - Always provide clear, professional responses.
        - If unsure, ask for more details or refer to customer support.
        - NEVER say "I don't sell products". Instead, guide users to relevant information.
        - Use friendly and engaging language.
        - Keep responses short but informative.
        
        Now, respond to the user's query:
        "${message}"
        `
                            }
                        ]
                    }
                ]
            }
        );

        res.json({ reply: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error("Error generating response:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

app.listen(port, () => {
    console.log(`Chatbot server running on http://localhost:${port}`);
});
