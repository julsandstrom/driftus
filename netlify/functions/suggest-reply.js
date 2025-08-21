import OpenAI from "openai";

const client = new OpenAI({
  apiKey: (process.env.OPENAI_API_KEY || "").trim(),
});

export const handler = async (event) => {
  try {
    const { lastMessage, maxWords = 12 } = JSON.parse(event.body || "{}");
    if (!lastMessage) return json(400, { error: "Missing lastMessage" });

    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 60,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "Analysera tonen i användarens senaste meddelande.",
            'Returnera strikt JSON: {"sentiment":"positive|neutral|negative","energy":0..1,"suggestions":["...","..."]}.',
            "ENERGY = känslointensitet/arousal: 0.0 = mycket lugn, 1.0 = mycket upprörd/upptänd (arg/exalterad).",
            `Ge 2–3 svarsförslag, max ${maxWords} ord/st. Matcha positiv ton; vid negativ/arg ton: avväpna lugnt.`,
            "Samma språk som input. Inga emojis om inte användaren använder emojis.",
          ].join(" "),
        },
        { role: "user", content: lastMessage },
      ],
    });

    const raw = r.choices[0]?.message?.content || "{}";
    const out = JSON.parse(raw);

    let energy =
      typeof out.energy === "number" ? out.energy : Number(out.energy);
    if (!isFinite(energy)) {
      energy =
        out.sentiment === "negative"
          ? 0.8
          : out.sentiment === "neutral"
          ? 0.5
          : 0.2;
    }
    energy = Math.max(0, Math.min(1, energy));

    return json(200, { ...out, energy });
  } catch (err) {
    return json(err?.status || 500, { error: err?.message || "AI error" });
  }
};

function json(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
