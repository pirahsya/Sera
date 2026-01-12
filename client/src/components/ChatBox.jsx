import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SendHorizontal, Square } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { streamAIChat } from "../services/chatService";
import Message from "./Message";
import toast from "react-hot-toast";

const ChatBox = () => {
  const containerRef = useRef(null);
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { chats, user, axios, token, fetchUser, fetchUsersChats } =
    useAppContext();

  const [prompt, setPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [optimisticMessages, setOptimisticMessages] = useState([]);

  const currentChat = useMemo(
    () => chats.find((c) => c._id === chatId),
    [chats, chatId]
  );

  const allMessages = useMemo(() => {
    return [...(currentChat?.messages || []), ...optimisticMessages];
  }, [currentChat, optimisticMessages]);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text || !user) return;

    setIsStreaming(true);
    setStreamText("");
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
        onChunk: (chunk) => setStreamText((prev) => prev + chunk),
        onDone: async () => {
          setIsStreaming(false);
          setStreamText("");
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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMessages, streamText]);

  return (
    <div
      key={chatId}
      className="flex flex-1 flex-col m-5 md:mx-0 mt-0 mb-10 max-md:mt-14"
    >
      <div className="flex flex-1 w-full overflow-y-scroll">
        <div
          ref={containerRef}
          className="flex flex-1 flex-col max-w-2xl mx-auto w-full"
        >
          {allMessages.length === 0 && !isStreaming && (
            <div className="flex flex-1 items-center justify-center text-primary">
              <p className="text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
                Tanya apa saja
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
                isImage: false,
              }}
            />
          )}

          {isStreaming && !streamText && (
            <div className="loader flex items-center gap-1.5 ml-2 mt-4">
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
          className="flex-1 w-full text-sm outline-none bg-transparent"
          required
        />
        <button
          disabled={isStreaming}
          className="cursor-pointer text-gray-600 dark:text-white disabled:opacity-50"
        >
          {isStreaming ? <Square size={20} /> : <SendHorizontal size={20} />}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
