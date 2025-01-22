import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(true); // Default to 'Host a Meeting'

  const handleHostRoom = async () => {
    if (name.trim()) {
      try {
        const response = await axios.post(
          //live-link part
          "https://code2-video-production.up.railway.app/api/rooms/create"
          
          //localhost part
          // "http://localhost:5000/api/rooms/create"
        );
        const newRoomId = response.data.roomId;
        navigate(`/room/${newRoomId}`, { state: { name, isHost: true } });
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };

  const handleJoinRoom = () => {
    if (name.trim() && roomId.trim()) {
      navigate(`/room/${roomId}`, { state: { name, isHost: false } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to Code-2-Share</h1>
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={() => setIsHost(true)}
          className={`bg-green-500 text-white px-6 py-2 rounded mb-4 ${
            isHost ? "bg-green-600" : ""
          }`}
        >
          Host a Meeting
        </button>
        <button
          onClick={() => setIsHost(false)}
          className={`bg-blue-500 text-white px-6 py-2 rounded ${
            !isHost ? "bg-blue-600" : ""
          }`}
        >
          Join a Meeting
        </button>
      </div>

      {isHost ? (
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded mb-4"
          />
          <button
            onClick={handleHostRoom}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Host Room
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded mb-4"
          />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border p-2 rounded mb-4"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Join Room
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
