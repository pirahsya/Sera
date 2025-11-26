import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Message from "./Message";
import { SendHorizontal, Square } from "lucide-react";

const ChatBox = () => {
  const containerRef = useRef(null);

  const { selectedChat, theme } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col justify between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-primary">
            <p className="text-4xl sm:text-6xl text-center text-gray-400 dark:text-white">
              Tanya apa saja
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Loading */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Prompt Inbux Box */}
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
