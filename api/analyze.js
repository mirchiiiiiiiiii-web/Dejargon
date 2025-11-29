// api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { contractText } = req.body || {};

    if (!contractText || typeof contractText !== "string") {
      res.status(400).json({ error: "contractText is required" });
      return;
    }

    const prompt = `
You are a contract analyst. Read the agreement text below and return JSON ONLY in this shape:

{
  "score": number,
  "scoreLabel": string,
  "summary": string,
  "highlights": string[],
  "issues": [
    { "id": number, "title": string, "description": string }
  ],
  "clauses": [
    { "title": string, "text": string }
  ]
}

Text:
"""${contractText}"""
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const analysisData = JSON.parse(
      completion.choices[0]?.message?.content || "{}"
    );

    res.status(200).json(analysisData);
  } catch (error) {
    console.error("analyze API error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
}
