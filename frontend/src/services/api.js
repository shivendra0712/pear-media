const API_BASE = "https://pear-media.onrender.com";


export async function enhancePrompt(prompt) {
  const res = await fetch(`${API_BASE}/api/text/enhance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  return res.json();
}

export async function generateImage(prompt) {
   console.log("generate prompt:", prompt);
  const res = await fetch(`${API_BASE}/api/image/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  return res.json();
}

export async function analyzeImage(formData) {
  console.log("analyzeImage formData:", formData);
  const res = await fetch(`${API_BASE}/api/image/analyze`, 
    {
      headers: { "Content-Type": "application/json" },
      method: "POST", 
      body: JSON.stringify({ formData })
    });
  console.log("analyzeImage response:", res);
  return res.json();
}
