import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Message from "./Message";
import { SendHorizontal, Square } from "lucide-react";
import toast from "react-hot-toast";

const ChatBox = () => {
  const containerRef = useRef(null);
  const { chatId } = useParams();
  const navigate = useNavigate();

  const { chats, user, axios, token, fetchUser, fetchUsersChats } =
    useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");

  useEffect(() => {
    if (chatId) {
      const found = chats.find((c) => c._id === chatId);
      if (found) {
        setMessages(found.messages || []);
      } else {
        axios
          .get(`/api/chat/${chatId}`, {
            headers: { Authorization: token },
          })
          .then(({ data }) => {
            if (!data.success) return navigate("/", { replace: true });
            setMessages(data.chat.messages || []);
          })
          .catch(() => navigate("/", { replace: true }));
      }
    } else {
      setMessages([]);
    }
  }, [chatId, chats]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text) return;
    if (!user) return toast.error("Silakan masuk terlebih dahulu");

    setIsStreaming(true);
    setStreamText("");
    setLoading(false);

    try {
      let id = chatId;

      if (!id) {
        const { data } = await axios.get("/api/chat/create", {
          headers: { Authorization: token },
        });

        if (!data.success || !data.chat) throw new Error("Gagal membuat chat");

        id = data.chat._id;

        await fetchUsersChats();

        navigate(`/c/${id}`, { replace: true });
      }

      const userMessage = {
        role: "user",
        content: text,
        timestamp: Date.now(),
        isImage: false,
      };

      setMessages((prev) => [...prev, userMessage]);
      setPrompt("");

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/message/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ chatId: id, prompt: text }),
        }
      );

      let finalText = "";

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let breakStreaming = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const decoded = decoder.decode(value, { stream: true });

        const lines = decoded.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const json = JSON.parse(line.replace("data: ", ""));

          if (json.type === "chunk") {
            setStreamText((prev) => prev + json.text);
            finalText += json.text;
          }

          if (json.type === "done") {
            setIsStreaming(false);
            breakStreaming = true;
            break;
          }

          if (json.type === "error") {
            toast.error(json.message);
            setIsStreaming(false);
            breakStreaming = true;
            break;
          }
        }

        if (breakStreaming) break;
      }

      if (finalText.trim() !== "") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: finalText,
            timestamp: Date.now(),
            isImage: false,
          },
        ]);
      }

      setStreamText("");
      setIsStreaming(false);

      await fetchUser();
      await fetchUsersChats();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col m-5 md:mx-0 mt-0 mb-10 max-md:mt-14">
      <div className="flex flex-1 w-full overflow-y-scroll">
        <div
          ref={containerRef}
          className="flex flex-1 flex-col max-w-2xl mx-auto w-full"
        >
          {messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-primary">
              <p className="text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
                Tanya apa saja
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}

          {isStreaming && streamText && (
            <Message
              message={{
                role: "assistant",
                content: streamText,
                isImage: false,
              }}
            />
          )}

          {loading && !isStreaming && (
            <div className="loader flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-primary/5 dark:bg-[#241E80]/30 border border-primary/20 dark:border-[#1E1980]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center"
      >
        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          className="flex-1 w-full text-sm outline-none"
          required
        />
        <button
          disabled={loading}
          className="cursor-pointer text-gray-600 dark:text-white"
        >
          {loading ? <Square size={20} /> : <SendHorizontal size={20} />}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
