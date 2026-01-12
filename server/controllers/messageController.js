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

export const streamMessageController = async (req, res) => {
  try {
    await messageService.streamMessage(req.user, req.body, res);
  } catch (error) {
    try {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders?.();
      }
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message: error.message || "Terjadi kesalahan saat streaming.",
        })}\n\n`
      );
      res.end();
    } catch (_) {
      if (!res.headersSent) {
        return res.status(500).json({ success: false, message: error.message });
      }
      try {
        res.end();
      } catch {}
    }
  }
};
