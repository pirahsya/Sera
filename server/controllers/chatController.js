import Chat from "../models/Chat.js";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chatData = {
      userId,
      messages: [],
      name: "",
      userName: req.user.name,
    };

    const chat = await Chat.create(chatData);

    res.json({ success: true, message: "Obrolan berhasil dibuat", chat });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select("_id name messages updatedAt")
      .sort({ updatedAt: -1 });

    res.json({ success: true, chats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.json({ success: false, message: "Chat tidak ditemukan" });
    }

    res.json({ success: true, chat });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const { chatId } = req.body;

    await Chat.deleteOne({ _id: chatId, userId });

    res.json({ success: true, message: "Obrolan berhasil dihapus" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
