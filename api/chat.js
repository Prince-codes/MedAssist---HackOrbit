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
                "X-Title": "Modern Med AI"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages,
                temperature: 0.7
            })
        });
        console.log("ENV KEY:", process.env.OPENROUTER_API_KEY);

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ message: data.error?.message || "API error" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.log("ENV KEY:", process.env.OPENROUTER_API_KEY);

        console.error("OpenRouter API error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}