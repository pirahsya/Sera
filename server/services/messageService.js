import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import imagekit from "../configs/imageKit.js";
import aiService from "./aiService.js";

async function handleMessage(user, { chatId, prompt }) {
  if (!prompt || !prompt.trim()) throw new Error("Prompt tidak boleh kosong.");

  const chat = await Chat.findOne({ userId: user._id, _id: chatId });
  if (!chat) throw new Error("Chat tidak ditemukan.");

  chat.messages.push({
    role: "user",
    content: prompt,
    timestamp: Date.now(),
    isImage: false,
  });

  const mode = await aiService.classifyPrompt(prompt);

  if (mode === "TEXT") {
    if (user.credits < 1)
      throw new Error("Kredit Anda tidak mencukupi untuk mengirim pesan teks.");

    if (!chat.name || chat.name.trim() === "") {
      chat.name = await aiService.generateTitle(prompt);
    }

    const assistantText = await aiService.generateText(prompt);

    const reply = {
      role: "assistant",
      content: assistantText,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: user._id }, { $inc: { credits: -1 } });

    return reply;
  }

  if (mode === "IMAGE") {
    if (user.credits < 2)
      throw new Error("Kredit Anda tidak mencukupi untuk membuat gambar.");

    const encodedPrompt = encodeURIComponent(prompt);
    const generatedImageUrl = `${
      process.env.IMAGEKIT_URL_ENDPOINT
    }/ik-genimg-prompt-${encodedPrompt}/sera/${Date.now()}.png?tr=w-800,h-800`;

    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data,
      "binary"
    ).toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "sera",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
    };

    chat.messages.push(reply);

    await chat.save();
    await User.updateOne({ _id: user._id }, { $inc: { credits: -2 } });

    return reply;
  }

  throw new Error("Mode prompt tidak dikenali oleh AI.");
}

async function streamMessage(user, { chatId, prompt }, res) {
  if (!prompt || !prompt.trim()) {
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message: "Prompt tidak boleh kosong.",
      })}\n\n`
    );
    return res.end();
  }

  const chat = await Chat.findOne({ userId: user._id, _id: chatId });
  if (!chat) {
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message: "Chat tidak ditemukan.",
      })}\n\n`
    );
    return res.end();
  }

  const mode = await aiService.classifyPrompt(prompt);

  if (mode === "TEXT" && user.credits < 1) {
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message: "Kredit Anda tidak mencukupi untuk mengirim pesan teks.",
      })}\n\n`
    );
    return res.end();
  }

  if (mode === "IMAGE" && user.credits < 2) {
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message: "Kredit Anda tidak mencukupi untuk membuat gambar.",
      })}\n\n`
    );
    return res.end();
  }

  chat.messages.push({
    role: "user",
    content: prompt,
    timestamp: Date.now(),
    isImage: false,
  });
  await chat.save();

  if (!chat.name || chat.name.trim() === "") {
    chat.name = await aiService.generateTitle(prompt);
    await chat.save();
  }

  if (mode === "TEXT") {
    let finalText = "";

    try {
      for await (const chunk of aiService.streamText(prompt)) {
        finalText += chunk;

        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            text: chunk,
          })}\n\n`
        );
      }

      chat.messages.push({
        role: "assistant",
        content: finalText,
        timestamp: Date.now(),
        isImage: false,
      });

      await chat.save();
      await User.updateOne({ _id: user._id }, { $inc: { credits: -1 } });

      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      return res.end();
    } catch (err) {
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message: err.message || "AI streaming error",
        })}\n\n`
      );
      return res.end();
    }
  }

  res.write(
    `data: ${JSON.stringify({
      type: "error",
      message: "Streaming hanya untuk jawaban teks.",
    })}\n\n`
  );
  return res.end();
}

export default { handleMessage, streamMessage };
