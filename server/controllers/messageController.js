import messageService from "../services/messageService.js";

export const messageController = async (req, res) => {
  try {
    const reply = await messageService.handleMessage(req.user, req.body);

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server.",
    });
  }
};
