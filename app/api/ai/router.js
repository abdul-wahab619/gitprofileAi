import { callOpenAI } from "./provider/openai";
import { callGemini } from "./provider/gemini";

export async function runAI(prompt) {
  let geminiError = null;
  let openAIError = null;

  // 1️⃣ Try Gemini first
  if (process.env.ENABLE_GEMINI === "true" && process.env.GEMINI_API_KEY) {
    try {
      return await callGemini(prompt);
    } catch (err) {
      geminiError = err;
      console.warn("⚠️ Gemini failed:", err.message);
    }
  } else {
    console.log("Gemini disabled or API key missing, skipping.");
  }

  // 2️⃣ OpenAI key rotation
  const openaiKeys = process.env.OPENAI_KEYS?.split(",") || [];

  for (const rawKey of openaiKeys) {
    const key = rawKey.trim();
    if (!key) continue;

    try {
      console.log("Trying OpenAI key...");
      return await callOpenAI(prompt, key);
    } catch (err) {
      openAIError = err;
      console.error("❌ OpenAI key failed:", err.message);

      // ⛔ Do NOT rotate key for non-quota errors
      if (
        !err.message.includes("429") &&
        !err.message.toLowerCase().includes("quota") &&
        !err.message.toLowerCase().includes("rate")
      ) {
        break;
      }
    }
  }

  // 3️⃣ Final clear error
  throw new Error(
    [
      "AI analysis failed.",
      geminiError ? `Gemini: ${geminiError.message}` : "Gemini: not attempted",
      openAIError ? `OpenAI: ${openAIError.message}` : "OpenAI: not attempted",
    ].join(" ")
  );
}
