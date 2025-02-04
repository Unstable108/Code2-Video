import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../images/bg_image/6.jpg";

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
          `${import.meta.env.VITE_BACKEND_URL}/api/rooms/create`
        );
        const newRoomId = response.data.roomId;
        navigate(`/room/${newRoomId}`, { state: { name, isHost: true } });
        setName(""); // Clear the name field
      } catch (error) {
        console.error("Error creating room:", error);
      }
    } else {
      toast.warn("Enter Your name");
    }
  };

  const handleJoinRoom = async () => {
    if (name.trim() && roomId.trim()) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/rooms/${roomId}`
        );
        if (response.status === 200) {
          navigate(`/room/${roomId}`, { state: { name, isHost: false } });
          setName(""); // Clear the name field
          setRoomId(""); // Clear the roomId field
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
      toast.warn("Enter name and Room ID.");
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r  from-[#823a4f] to-[#1c4171] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">
                Welcome to Code-2-Share
              </h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
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
                    <div className="relative w-full mb-4">
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off" // Disable autocomplete
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Your Name
                      </label>
                    </div>
                    <button
                      onClick={handleHostRoom}
                      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                      Host Room
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full mb-4">
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off" // Disable autocomplete
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      />
                      <label
                        htmlFor="name"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Your Name
                      </label>
                    </div>
                    <div className="relative w-full mb-4">
                      <input
                        type="text"
                        id="roomId"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        autoComplete="off" // Disable autocomplete
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      />
                      <label
                        htmlFor="roomId"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Room ID
                      </label>
                    </div>
                    <button
                      onClick={handleJoinRoom}
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      {loading ? "Joining..." : "Join Room"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
