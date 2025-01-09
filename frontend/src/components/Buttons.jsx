import React from "react";

const Buttons = ({ roomId }) => {
  const copyToClipboard = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId).then(
        () => alert("Room ID copied to clipboard!"),
        (err) => alert("Failed to copy Room ID.")
      );
    } else {
      alert("Room ID not available.");
    }
  };
  return (
    <div className="flex flex-col space-y-4">
      <button className="p-3 bg-blue-500 text-white rounded-md">
        Start Video
      </button>
      <button className="p-3 bg-red-500 text-white rounded-md">
        Leave Meeting
      </button>
      <button
        onClick={copyToClipboard}
        className="p-3 bg-green-500 text-white rounded-md"
      >
        Copy Room-ID
      </button>
    </div>
  );
};

export default Buttons;
