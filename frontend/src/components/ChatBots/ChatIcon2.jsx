import React, { useState } from "react";

const ChatIcon2 = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium border rounded-full w-16 h-16 bg-green-600 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        type="button"
        onClick={toggleChat}
        aria-haspopup="dialog"
        aria-expanded={isChatOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="block"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>

      {/* Chatbox */}
      {isChatOpen && (
        <div className="fixed bottom-[calc(4rem+1.5rem)] right-4 bg-white p-6 rounded-lg border border-gray-200 shadow-md w-[90%] sm:w-[440px] h-[70%] sm:h-[634px] flex flex-col">
          {/* Chat Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-300">
            <div>
              <h2 className="font-semibold text-lg">Chats</h2>
              <p className="text-sm text-gray-500">Designed by unstable</p>
            </div>
            <button
              className="text-gray-500 hover:text-black focus:outline-none"
              onClick={toggleChat}
              aria-label="Close Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto pr-4">
            {/* AI Message */}
            <div className="flex gap-3 my-4 text-sm">
              <div className="w-8 h-8 bg-gray-100 border rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  width="20"
                  viewBox="0 0 24 24"
                  fill="black"
                >
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <span className="block font-bold text-gray-700">AI</span>
                <p className="text-gray-600">Hi, how can I help you today?</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-3 my-4 text-sm">
              <div className="w-8 h-8 bg-gray-100 border rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  width="20"
                  viewBox="0 0 16 16"
                  fill="black"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                </svg>
              </div>
              <div>
                <span className="block font-bold text-gray-700">You</span>
                <p className="text-gray-600">Can you help me?</p>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-300">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Type your message"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIcon2;
