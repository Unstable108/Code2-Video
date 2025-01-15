import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSocket } from "../context/socketContext";

const Chat = ({ roomId, name }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && name) {
      // Join room
      socket.emit("join-room", { roomId, userName: name });

      // Listen for received messages
      const handleReceiveMessage = (message) => {
        setMessages((prev) => [...prev, message]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll
      };

      socket.on("receive-message", handleReceiveMessage);

      return () => {
        // Cleanup event listener
        socket.off("receive-message", handleReceiveMessage);
      };
    }
  }, [socket, roomId, name]);

  const sendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit("send-message", {
        roomId,
        message: newMessage,
        sender: name,
      });
      setNewMessage(""); // Clear input field
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div
        className="flex-1 overflow-y-auto mb-4 space-y-2 border rounded"
        style={{ maxHeight: "300px" }} // Adjust the height as needed
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === name ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-sm ${
                msg.sender === name
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
              style={{
                borderRadius: "16px",
                padding: "10px 15px",
                wordWrap: "break-word",
              }}
            >
              <strong>{msg.sender === name ? "" : msg.sender}</strong>
              <div>{msg.message}</div>
              <div
                className="text-gray-200 text-xs mt-1"
                style={{ fontSize: "10px", textAlign: "right" }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e)}
          className="flex-1 border p-2 rounded mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded"
          style={{
            borderRadius: "25px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
Chat.propTypes = {
  roomId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Chat;
