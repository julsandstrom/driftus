import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler = async (event) => {
  try {
    const { lastMessage, maxWords = 12 } = JSON.parse(event.body || "{}");
    if (!lastMessage) return json(400, { error: "Missing lastMessage" });

    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "Du föreslår 2–3 korta svar på samma språk som input.",
            'Returnera strikt JSON: {"sentiment":"positive|neutral|negative","energy":0..1,"suggestions":["...","..."]}.',
            `Varje förslag max ${maxWords} ord.`,
            "Vid positiv ton: matcha. Vid negativ/arg ton: lugn, avväpnande, stöttande. Inga emojis om inte användaren använder emojis.",
          ].join(" "),
        },
        { role: "user", content: lastMessage },
      ],
    });

    const content = r.choices[0]?.message?.content || "{}";
    return json(200, JSON.parse(content));
  } catch (err) {
    return json(500, { error: err?.message || "AI error" });
  }
};

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
