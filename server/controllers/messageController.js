import messageService from "../services/messageService.js";

export const messageController = async (req, res) => {
  try {
    const reply = await messageService.handleMessage(req.user, req.body);
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Message Error:", error.message);
    res.json({
      success: false,
      message: "Gagal memproses permintaan. Silakan coba lagi.",
    });
  }
};

export const streamMessageController = async (req, res) => {
  try {
    await messageService.streamMessage(req.user, req.body, res);
  } catch (error) {
    console.error("Stream Error:", error.message);
    try {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders?.();
      }

      const errorResponse = {
        type: "error",
        message:
          "Layanan sedang sibuk atau terjadi gangguan. Silakan coba sesaat lagi.",
      };

      res.write(`data: ${JSON.stringify(errorResponse)}\n\n`);
      res.end();
    } catch (writeError) {
      if (!res.headersSent) {
        return res
          .status(500)
          .json({ success: false, message: "Terjadi kesalahan server." });
      }
      try {
        res.end();
      } catch {}
    }
  }
};
