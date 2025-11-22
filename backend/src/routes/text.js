// routes/text.js
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
let genAI = null;
if (GEMINI_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_KEY);
}

// Helper function to call OpenAI
async function callOpenAI(systemPrompt, userPrompt) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
        }),
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    return data.choices[0].message.content;
}

// POST { prompt: "..." }
router.post("/enhance", async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log("Prompt:", prompt);

        if (!prompt) return res.status(400).json({ error: "prompt required" });

        let analysisTextData = null;
        let enhancedText = null;
        let provider = null;

        // Try Gemini first
        if (genAI && GEMINI_KEY) {
            try {
                console.log("Trying Gemini for text enhancement...");
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                // 1️⃣ Analyze tone, intent, missing details
                const analysisResult = await model.generateContent(
                    `Analyze the following prompt and return JSON with:
              { tone, intent, missing_details }

              PROMPT: "${prompt}"`
                );

                const analysisText = analysisResult.response.text();
                const cleaned = analysisText.replace(/```json|```/g, "").trim();
                analysisTextData = JSON.parse(cleaned);

                console.log("Analysis:", analysisTextData);

                // 2️⃣ Enhance the prompt
                const enhancedResult = await model.generateContent(
                    `
                    You are an expert prompt-engineering assistant.

                    Your task:
                    1. Read the ORIGINAL user prompt.
                    2. Read the ANALYSIS details (tone + intent).
                    3. Produce an improved, enhanced prompt suitable for IMAGE GENERATION.
                    4. Return ONLY the enhanced prompt as a **single plain string**.
                    5. Do NOT return JSON, markdown, bullets, or explanations. JUST the improved prompt.

                    ORIGINAL PROMPT:
                    "${prompt}"

                    ANALYSIS DETAILS:
                    Tone: ${analysisTextData.tone}
                    Intent: ${analysisTextData.intent}
                    Missing details (if any): ${analysisTextData.missing_details ?? "None"}

                    Now rewrite the prompt into a detailed, visually descriptive, image-ready version.
                    `
                );

                enhancedText = enhancedResult.response.text();
                provider = "Gemini";
                console.log("Enhanced (Gemini):", enhancedText);

            } catch (err) {
                console.error("Gemini Error:", err.message);
                // Fall through to OpenAI
            }
        }

        // Try OpenAI if Gemini failed or not available
        if (!enhancedText && process.env.OPENAI_API_KEY) {
            try {
                console.log("Trying OpenAI for text enhancement...");

                // 1️⃣ Analyze with OpenAI
                const analysisPrompt = `Analyze the following prompt and return ONLY valid JSON with this exact structure:
{ "tone": "...", "intent": "...", "missing_details": "..." }

PROMPT: "${prompt}"`;

                const analysisResponse = await callOpenAI(
                    "You are a prompt analysis expert. Return only valid JSON.",
                    analysisPrompt
                );

                const cleaned = analysisResponse.replace(/```json|```/g, "").trim();
                analysisTextData = JSON.parse(cleaned);

                console.log("Analysis (OpenAI):", analysisTextData);

                // 2️⃣ Enhance with OpenAI
                const enhancePrompt = `
ORIGINAL PROMPT: "${prompt}"

ANALYSIS:
- Tone: ${analysisTextData.tone}
- Intent: ${analysisTextData.intent}
- Missing details: ${analysisTextData.missing_details ?? "None"}

Rewrite this into a detailed, visually descriptive prompt suitable for image generation. Return ONLY the enhanced prompt text, no explanations.`;

                enhancedText = await callOpenAI(
                    "You are an expert prompt-engineering assistant for image generation.",
                    enhancePrompt
                );

                provider = "OpenAI";
                console.log("Enhanced (OpenAI):", enhancedText);

            } catch (err) {
                console.error("OpenAI Error:", err.message);
                throw new Error("All text enhancement providers failed");
            }
        }

        if (!enhancedText) {
            throw new Error("No API keys configured for text enhancement");
        }

        res.json({
            analysis: analysisTextData,
            enhanced: enhancedText,
            provider: provider,
        });
    } catch (err) {
        console.error("Text Enhancement Error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
