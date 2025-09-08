export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",   // required by OpenRouter
        "X-Title": "MedAI-Assist"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",   // ✅ reliable model
        messages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.error?.message || "API error" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
