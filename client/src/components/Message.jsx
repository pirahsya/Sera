import { useEffect } from "react";
import Markdown from "react-markdown";
import Prism from "prismjs";

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500">
      {message.role === "user" ? (
        <div className="flex justify-end my-2">
          <div className="max-w-[85%] md:max-w-2xl p-3 px-5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl rounded-tr-sm overflow-hidden">
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed wrap-break-word">
              {message.content}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-start my-2">
          <div className="max-w-[95%] md:max-w-3xl p-3 px-5 bg-transparent border border-transparent rounded-3xl rounded-tl-sm overflow-hidden">
            {message.isImage ? (
              <div className="space-y-3">
                <img
                  src={message.content}
                  alt="AI Generated"
                  className="w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.02]"
                />
              </div>
            ) : (
              <div className="text-sm prose dark:prose-invert prose-slate max-w-none leading-relaxed text-gray-700 dark:text-gray-300 reset-tw wrap-break-word">
                <Markdown>{message.content}</Markdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
