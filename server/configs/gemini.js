import { GoogleGenerativeAI } from "@google/generative-ai";

const rawKeys = process.env.GEMINI_API_KEY || "";
const apiKeys = rawKeys.split(",").filter((key) => key.trim() !== "");
let currentKeyIndex = 0;

const getModelInstance = (index) => {
  if (apiKeys.length === 0) return null;
  const genAI = new GoogleGenerativeAI(apiKeys[index]);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export let textModel = getModelInstance(currentKeyIndex);

export const rotateApiKey = () => {
  if (apiKeys.length <= 1) return textModel;
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  textModel = getModelInstance(currentKeyIndex);
  return textModel;
};

export async function runTextModel(prompt) {
  try {
    if (!textModel) throw new Error("API Key tidak ditemukan.");
    const result = await textModel.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    if (
      error.message.includes("404") ||
      error.message.includes("429") ||
      error.message.includes("API_KEY_INVALID")
    ) {
      if (apiKeys.length > 1) {
        rotateApiKey();
        const result = await textModel.generateContent(prompt);
        return result.response.text().trim();
      }
    }
    throw error;
  }
}
