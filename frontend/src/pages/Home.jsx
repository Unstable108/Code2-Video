import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isHost, setIsHost] = useState(true); // Default to 'Host a Meeting'
  const [loading, setLoading] = useState(false);

  const handleHostRoom = async () => {
    if (name.trim()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/rooms/create"
        );
        const newRoomId = response.data.roomId;
        navigate(`/room/${newRoomId}`, { state: { name, isHost: true } });
      } catch (error) {
        console.error("Error creating room:", error);
      }
    }
  };

  const handleJoinRoom = async () => {
    if (name.trim() && roomId.trim()) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/rooms/${roomId}`
        );
        if (response.status === 200) {
          navigate(`/room/${roomId}`, { state: { name, isHost: false } });
        }
      } catch (error) {
        console.error("Error joining room:", error);
        if (error.response && error.response.status === 404) {
          toast.error("Room not found");
        } else {
          toast.error("An error occurred.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.warn("enter name and Room ID.");
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
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Room"}
          </button>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Home;
