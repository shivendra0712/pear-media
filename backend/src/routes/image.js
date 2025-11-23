
import express from "express";
import { GoogleGenerativeAI , HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

const GEMINI_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
if (GEMINI_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_KEY);
}

const IMAGE_MODEL = "gemini-2.5-flash-image-preview";


router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Prompt:", prompt);
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    console.log("Trying Gemini Image…");

    const model = genAI.getGenerativeModel({
      model: IMAGE_MODEL,
    });

    const result = await model.generateContent(prompt);

    console.log("result:", result)


    // Gemini may return imageUri instead of base64
    const parts = result?.response?.candidates?.[0]?.content?.parts || [];
    let imageUrl = null;

    for (const p of parts) {
      // Check if Gemini returned a URI
      if (p.uri) {
        imageUrl = p.uri;
        break;
      }
      // fallback to inlineData if needed
      if (p.inlineData?.data) {
        // Optionally, save buffer as file and return URL
        imageUrl = `data:image/png;base64,${p.inlineData.data}`;
      }
    }

    if (!imageUrl) {
      throw new Error("No image returned by Gemini");
    }

    return res.json({
      status: "Image generated successfully",
      model: IMAGE_MODEL,
      prompt,
      image: imageUrl, // direct URL or fallback
    });

  } catch (error) {
    console.error("Image Gen Error:", error);
    res.status(500).json({ error: error.message });
  }
});


const MULTIMODAL_MODEL = "gemini-2.5-flash";
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

let geminiModelInstance = null;

function getGeminiModel() {
  if (!geminiModelInstance) {
    
    geminiModelInstance = genAI.getGenerativeModel({
      model: MULTIMODAL_MODEL,
      safetySettings: safetySettings
    });
  }
  return geminiModelInstance;
}

function fileToGenerativePart(base64Data, mimeType) {
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
}


router.post("/analyze", async (req, res) => {
  try {
   
    const {formData}= req.body;
    const { type, base64Image, mimeType } = formData;
   

    const geminiModel = getGeminiModel();
    let instruction;
    let response;
    if (type === 'analyze' && base64Image && mimeType) {

      instruction = "Analyze this image. Describe its primary subject, style, color palette, and mood. Generate a high-quality, creative prompt of 50-70 words suitable for an image generation model to create similar variations. Output ONLY the generated prompt text.";

      const imagePart = fileToGenerativePart(base64Image, mimeType);

      response = await geminiModel.generateContent([
        { text: instruction },
        imagePart
      ]);

    } else {
      return res.status(400).json({ error: "Invalid request type or missing parameters." });
    }

  
    const textResult = response?.response?.text()?.trim() || "No text returned";
    console.log("textResult:", textResult);
    return res.json({ result: textResult });

  } catch (err) {
    console.error("Analyze Error:", err); // <-- check this log in console
    res.status(500).json({ error: err.message });
  }
});


export default router;
