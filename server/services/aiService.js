import { runTextModel, textModel } from "../configs/gemini.js";

async function classifyPrompt(prompt) {
  const instruction = `
Klasifikasikan prompt berikut dan jawab SATU KATA SAJA:
- IMAGE → jika pengguna meminta dibuatkan gambar, ilustrasi, logo, ikon, poster atau foto
- TEXT → jika pengguna hanya bertanya atau meminta jawaban teks

Jangan beri tambahan penjelasan lain!

PROMPT:
${prompt}
`;

  const result = (await runTextModel(instruction)).toUpperCase().trim();

  if (result.startsWith("IMAGE")) return "IMAGE";
  return "TEXT";
}

async function generateText(prompt) {
  return await runTextModel(prompt);
}

async function generateTitle(prompt) {
  const instruction = `
Buat judul yang singkat, jelas, dan maksimal 6 kata.
Judul harus mewakili inti percakapan berikut:

"${prompt}"

Jawab hanya judulnya, tanpa penjelasan.
`;

  const title = await runTextModel(instruction);

  return title.trim();
}

async function* streamText(prompt) {
  const result = await textModel.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

export default {
  classifyPrompt,
  generateText,
  generateTitle,
  streamText,
};
