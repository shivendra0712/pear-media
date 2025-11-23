

import React, { useState } from "react";
import { analyzeImage } from "../services/api";
import { generateImage } from "../services/api";

export default function ImageFlow() {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [variation, setVariation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageurl, setImageurl] = useState(null);

  const handleAnalyze = async () => {
   if (!file) return;

   console.log("file:", file);
  // Convert file to base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64String = reader.result.split(",")[1];

    const payload = {
      type: "analyze",
      base64Image: base64String,
      mimeType: file.type,
    };
    
    console.log("payload:", payload);

    const data = await analyzeImage(payload);
    setDescription(data.result); // backend sends { result: "...text..." }
  };
  reader.readAsDataURL(file);
    //setDescription(data.description);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateImage(description);
    const imageURL = data?.image || null;
    setImageurl(imageURL);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-1/2 bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-gray-900/40 border border-gray-700/40 backdrop-blur-md rounded-2xl p-6 shadow-xl">

        <h3 className="text-2xl font-semibold text-white text-center mb-6">
          Image → Analyze → Generate
        </h3>

        {/* File upload */}
        <label className="text-gray-200 font-medium">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          className="w-full mt-2 mb-4 text-gray-300 file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0 file:bg-purple-600 file:text-white
          hover:file:bg-purple-700 cursor-pointer bg-gray-800/60 p-2 rounded-xl border border-gray-700/50"
        />

        <button
          onClick={handleAnalyze}
          className="w-full py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700
          text-white shadow-md hover:shadow-purple-500/30 transition"
        >
          Analyze Image
        </button>

        {/* Description */}
        {description && (
          <div className="mt-6 text-gray-200">
            <p className="text-white font-medium mb-2">Generated Description:</p>
            <p className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 text-sm text-gray-300">
              {description}
            </p>

            <button
              onClick={handleGenerate}
              className="w-full mt-4 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700
              text-white shadow-md hover:shadow-indigo-500/30 transition"
            >
              Generate Image
            </button>
          </div>
        )}

        {/* Final Generated Image */}
        {imageurl && (
          <div className="mt-6">
            <h4 className="text-gray-200 font-medium mb-2">Generated Image</h4>
            <img
              src={imageurl}
              alt="Generated"
              className="w-full rounded-xl shadow-lg border border-gray-700/40"
            />
          </div>
        )}

        {/* Variation (if any) */}
        {variation && (
          <div className="mt-6">
            <h4 className="text-gray-200 font-medium mb-2">Variation</h4>
            <img
              src={variation}
              alt="Generated Variation"
              className="w-full rounded-xl shadow-lg border border-gray-700/40"
            />
          </div>
        )}

      </div>
    </div>
  );
}
