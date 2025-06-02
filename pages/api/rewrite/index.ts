import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  output?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, tone } = req.body;

  if (!input || !tone) {
    return res.status(400).json({ error: "Missing input or tone" });
  }

  const prompt = `Rewrite this text in a ${tone} tone:\n\n${input}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You rewrite text in the specified tone." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();

    const output = data.choices?.[0]?.message?.content || "No response from AI.";

    return res.status(200).json({ output });
  } catch (_) {
    return res.status(500).json({ error: "API request failed" });
  }
}
