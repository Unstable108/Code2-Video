import { useState } from "react";
import Chat from "../Chat";

const ChatIcon = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-5 right-5">
      {/* Chat Icon Button */}
      {!isChatOpen && (
        <button
          className="rounded-full bg-blue-500 text-white p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          onClick={toggleChat}
          aria-label="Open Chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 16h10M2 9h20M2 15h20"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 w-full sm:w-96 h-3/4 bg-white shadow-lg rounded-t-lg flex flex-col transition-transform duration-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between bg-blue-500 text-white px-4 py-2 rounded-t-lg">
            <h2 className="font-semibold">Chat with us</h2>
            <button
              className="text-white hover:text-gray-300 focus:outline-none"
              onClick={toggleChat}
              aria-label="Close Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
            <Chat />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-gray-200">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
