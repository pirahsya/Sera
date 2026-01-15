import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SendHorizontal, Square } from "lucide-react";
import { useAppContext } from "../context/useAppContext";
import { streamAIChat } from "../services/chatService";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const scrollRef = useRef(null);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { chats, user, axios, token, fetchUser, fetchUsersChats } =
    useAppContext();

  const [prompt, setPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [isImageResult, setIsImageResult] = useState(false);
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  const currentChat = useMemo(
    () => chats.find((c) => c._id === chatId),
    [chats, chatId]
  );

  const allMessages = useMemo(() => {
    return [...(currentChat?.messages || []), ...optimisticMessages];
  }, [currentChat, optimisticMessages]);

  const scrollToBottom = (behavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (chatId && !currentChat) {
      axios
        .get(`/api/chat/${chatId}`, { headers: { Authorization: token } })
        .then(({ data }) => {
          if (!data.success) return navigate("/", { replace: true });
          fetchUsersChats();
        })
        .catch(() => navigate("/", { replace: true }));
    }
  }, [chatId, currentChat, axios, navigate, token, fetchUsersChats]);

  useEffect(() => {
    if (allMessages.length > 0) {
      scrollToBottom("instant");
    }
  }, [chatId, chats.length > 0, allMessages.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const threshold = 150;
    const isAtBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + threshold;

    if (isAtBottom || optimisticMessages.length > 0) {
      const behavior = optimisticMessages.length > 0 ? "smooth" : "instant";
      requestAnimationFrame(() => {
        scrollToBottom(behavior);
      });
    }
  }, [allMessages, streamText, optimisticMessages.length]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || !user || isStreaming) return;

    setIsStreaming(true);
    setStreamText("");
    setIsImageResult(false);
    setPrompt("");

    const userMessage = {
      role: "user",
      content: text,
      timestamp: Date.now(),
      isImage: false,
    };

    setOptimisticMessages((prev) => [...prev, userMessage]);

    try {
      let currentId = chatId;

      if (!currentId) {
        const { data } = await axios.get("/api/chat/create", {
          headers: { Authorization: token },
        });

        if (!data.success || !data.chat) {
          throw new Error(data.message || "Gagal membuat obrolan baru");
        }

        currentId = data.chat._id;
        await fetchUsersChats();
        navigate(`/c/${currentId}`, { replace: true });
      }

      await streamAIChat({
        chatId: currentId,
        prompt: text,
        token,
        onChunk: (chunk, isImage) => {
          if (isImage) setIsImageResult(true);
          setStreamText((prev) => prev + chunk);
        },
        onDone: async () => {
          setIsStreaming(false);
          setStreamText("");
          setIsImageResult(false);
          setOptimisticMessages([]);
          await fetchUsersChats();
          await fetchUser();
        },
        onError: (err) => {
          toast.error(err);
          setIsStreaming(false);
        },
      });
    } catch (err) {
      toast.error(err.message);
      setIsStreaming(false);
    }
  };

  return (
    <div
      key={chatId}
      className="flex flex-1 flex-col h-full w-full bg-white dark:bg-gray-950 transition-colors duration-200"
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 custom-scrollbar scroll-smooth h-full"
      >
        <div
          className={`max-w-3xl mx-auto w-full flex flex-col gap-6 ${
            allMessages.length === 0 ? "h-full justify-center" : ""
          }`}
        >
          {allMessages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight text-center">
                Tanya apa saja
              </h1>
              <p className="mt-3 text-gray-500 dark:text-gray-400 text-center">
                Sera siap membantu pekerjaan Anda.
              </p>
            </div>
          )}

          {allMessages.map((message, index) => (
            <Message key={index} message={message} />
          ))}

          {isStreaming && streamText && (
            <Message
              message={{
                role: "assistant",
                content: streamText,
                isImage: isImageResult,
              }}
            />
          )}

          {isStreaming && !streamText && (
            <div className="flex items-center gap-2 ml-4 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce"></div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6 bg-linear-to-t from-white via-white dark:from-gray-950 dark:via-gray-950 to-transparent">
        <form
          onSubmit={onSubmit}
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-4xl w-full max-w-3xl mx-auto flex items-center p-2 pl-6 focus-within:ring-2 focus-within:ring-gray-100 dark:focus-within:ring-gray-800 transition-all"
        >
          <input
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            type="text"
            placeholder="Apa yang bisa Sera bantu?"
            className="flex-1 py-3 text-sm outline-none bg-transparent dark:text-white placeholder:text-gray-500"
            required
          />
          <button
            type="submit"
            disabled={isStreaming || !prompt.trim()}
            className="p-3 ml-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 disabled:opacity-30 disabled:cursor-default transition-all cursor-pointer shadow-md"
          >
            {isStreaming ? (
              <Square size={18} fill="currentColor" />
            ) : (
              <SendHorizontal size={18} />
            )}
          </button>
        </form>
        <p className="text-[10px] text-center mt-3 text-gray-400 dark:text-gray-500">
          Sera dapat membuat kesalahan. Periksa informasi penting.
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
