import { runTextModel } from "../configs/gemini.js";

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

export default {
  classifyPrompt,
  generateText,
  generateTitle,
};
