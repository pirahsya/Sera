export const streamAIChat = async ({
  chatId,
  prompt,
  token,
  onChunk,
  onError,
  onDone,
}) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/message/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ chatId, prompt }),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal terhubung ke server");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let finalText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const decoded = decoder.decode(value, { stream: true });
      const lines = decoded.split("\n\n");

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const json = JSON.parse(line.replace("data: ", ""));

        if (json.type === "chunk") {
          finalText += json.text;
          onChunk(json.text);
        } else if (json.type === "done") {
          onDone(finalText);
          return;
        } else if (json.type === "error") {
          throw new Error(json.message);
        }
      }
    }
  } catch (err) {
    onError(err.message);
  }
};
