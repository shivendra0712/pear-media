
// import React, { useState } from "react";
// import { enhancePrompt, generateImage } from "../services/api";

// export default function TextFlow() {
//   const [prompt, setPrompt] = useState("");
//   const [analysis, setAnalysis] = useState("");
//   const [enhanced, setEnhanced] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [imageurl, setImageurl] = useState(null);

//   const handleEnhance = async () => {
//     setLoading(true);
//     const data = await enhancePrompt(prompt);
//     setAnalysis(data.analysis || "");
//     setEnhanced(data.enhanced || "");
//     setLoading(false);
//   };

//   const handleGenerate = async () => {
//     setLoading(true);
//     const data = await generateImage(enhanced);
//     const imageURL = data?.image || null;
//     setImageurl(imageURL);
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen w-1/2 bg-gray-950 flex items-center justify-center p-4">
//       <div className="max-w-xl w-full bg-gray-900/40 border border-gray-700/40 backdrop-blur-md rounded-2xl p-6 shadow-xl">

//         <h3 className="text-2xl font-semibold text-white text-center mb-6">
//           Text → Enhance → Generate
//         </h3>

//         {/* Prompt Input */}
//         <label className="text-gray-200 font-medium">Enter Prompt</label>
//         <textarea
//           value={prompt}
//           onChange={e => setPrompt(e.target.value)}
//           placeholder="Describe your idea..."
//           rows={4}
//           className="w-full mt-2 mb-4 p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 border border-gray-700/50 focus:ring-2 focus:ring-purple-500 outline-none transition"
//         />

//         <button
//           onClick={handleEnhance}
//           disabled={loading || !prompt}
//           className={`w-full py-3 rounded-xl font-semibold transition ${
//             loading
//               ? "bg-gray-600 text-gray-300 cursor-not-allowed"
//               : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-500/30"
//           }`}
//         >
//           {loading ? "Enhancing..." : "Enhance Prompt"}
//         </button>

//         {/* Analysis */}
//         {analysis && (
//           <div className="mt-6 p-4 bg-gray-800/40 border border-gray-700/40 rounded-xl text-gray-200 text-sm">
//             <p className="font-medium text-white">Analysis:</p>
//             <pre className="whitespace-pre-wrap mt-2 text-gray-300">
//               {analysis?.tone}
//             </pre>
//           </div>
//         )}

//         {/* Enhanced Prompt */}
//         {enhanced && (
//           <>
//             <h4 className="text-gray-200 font-medium mt-6 mb-2">
//               Enhanced Prompt
//             </h4>
//             <textarea
//               value={enhanced}
//               onChange={e => setEnhanced(e.target.value)}
//               rows={3}
//               className="w-full p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 border border-gray-700/50 focus:ring-2 focus:ring-purple-500 outline-none transition"
//             />

//             <button
//               onClick={handleGenerate}
//               className="w-full mt-4 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/30 transition"
//             >
//               Generate Image
//             </button>
//           </>
//         )}

//         {/* Image Output */}
       
//         {imageurl && (
//           <div className="mt-6">
//             <h4 className="text-gray-200 font-medium mb-2">
//               Generated Image
//             </h4>
//             <img
//               src={imageurl}
//               alt="Generated"
//               className="w-full rounded-xl shadow-lg border border-gray-700/40"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { enhancePrompt, generateImage } from "../services/api";

export default function TextFlow() {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [enhanced, setEnhanced] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageurl, setImageurl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  const handleEnhance = async () => {
    setLoading(true);
    const data = await enhancePrompt(prompt);
    setAnalysis(data.analysis || "");
    setEnhanced(data.enhanced || "");
    setLoading(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setImageLoading(true);
    const data = await generateImage(enhanced);
    const imageURL = data?.image || null;
    setImageurl(imageURL);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-1/2 bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-gray-900/40 border border-gray-700/40 backdrop-blur-md rounded-2xl p-6 shadow-xl">

        <h3 className="text-2xl font-semibold text-white text-center mb-6">
          Text → Enhance → Generate
        </h3>

        {/* Prompt Input */}
        <label className="text-gray-200 font-medium">Enter Prompt</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your idea..."
          rows={4}
          className="w-full mt-2 mb-4 p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 border border-gray-700/50 focus:ring-2 focus:ring-purple-500 outline-none transition"
        />

        <button
          onClick={handleEnhance}
          disabled={loading || !prompt}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-500/30"
          }`}
        >
          {loading ? "Enhancing..." : "Enhance Prompt"}
        </button>

        {/* Analysis */}
        {analysis && (
          <div className="mt-6 p-4 bg-gray-800/40 border border-gray-700/40 rounded-xl text-gray-200 text-sm">
            <p className="font-medium text-white">Analysis:</p>
            <pre className="whitespace-pre-wrap mt-2 text-gray-300">
              {analysis?.tone}
            </pre>
          </div>
        )}

        {/* Enhanced Prompt */}
        {enhanced && (
          <>
            <h4 className="text-gray-200 font-medium mt-6 mb-2">
              Enhanced Prompt
            </h4>
            <textarea
              value={enhanced}
              onChange={e => setEnhanced(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-gray-800/60 text-white placeholder-gray-400 border border-gray-700/50 focus:ring-2 focus:ring-purple-500 outline-none transition"
            />

            <button
              onClick={handleGenerate}
              className="w-full mt-4 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/30 transition"
            >
              Generate Image
            </button>
          </>
        )}

        {/* Image Output */}
        {imageurl && (
          <div className="mt-6">
            <h4 className="text-gray-200 font-medium mb-2">Generated Image</h4>

            {/* Loader */}
            {imageLoading && (
              <div className="w-full h-64 flex items-center justify-center bg-gray-900/50 rounded-xl border border-gray-700/40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            {/* Actual Image */}
            <img
              src={imageurl}
              alt="Generated"
              onLoad={() => setImageLoading(false)}
              className={`w-full rounded-xl shadow-lg border border-gray-700/40 transition-opacity duration-500 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
