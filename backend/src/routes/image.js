
import vision from "@google-cloud/vision";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const client = new vision.ImageAnnotatorClient({
  projectId: "solid-coral-479009-d8",
  keyFilename: "vision-key.json"
}); 

const router = express.Router();

// import express from "express";
import multer from "multer";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// const GEMINI_KEY = process.env.GEMINI_API_KEY;


const GEMINI_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
if (GEMINI_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_KEY);
}

const IMAGE_MODEL = "gemini-2.5-flash-image-preview";

// --- IMAGE GENERATION ---
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


router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image file required." });

    // Convert buffer to base64
    const imageBase64 = req.file.buffer.toString("base64");
    console.log(imageBase64);

    // Call Google Vision API
    const [result] = await client.labelDetection({ image: { content: imageBase64 } });

    // Extract labels
    const labels = result.labelAnnotations.map(label => label.description);
    const description = "This image may contain: " + labels.join(", ");

    res.json({ description });

  } catch (err) {
    console.error("Analyze Error:", err); // <-- check this log in console
    res.status(500).json({ error: err.message });
  }
});


router.post("/generate-variation", async (req, res) => {
 try {
  console.log(req.body);
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt required" });

    console.log("Trying Gemini Image…");

    const model = genAI.getGenerativeModel({
      model: IMAGE_MODEL,
    });

    const result = await model.generateContent([{ text: prompt }]);
    

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


export default router;
