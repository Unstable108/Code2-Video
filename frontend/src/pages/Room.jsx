import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import VideoCall from "../components/VideoCall";
import Buttons from "../components/Buttons";

import { io } from "socket.io-client";

const Room = () => {
  const { id: roomId } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [users, setUsers] = useState([]);
  let socket;

  useEffect(() => {
    if (name) {
      // Initialize socket connection here
      socket = io("http://localhost:5000", {
        withCredentials: true, // Ensures credentials like cookies are sent
      });
      socket.on("connect", () => {
        console.log("Connected to server with ID:", socket.id);
      });
      socket.emit("join-room", { roomId, userName: name });

      socket.on("room-data", (updatedUsers) => {
        setUsers(updatedUsers.map((user) => user.name)); // Extract user names
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [roomId, name]);

  return (
    <div className="h-screen p-4">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">Code-2-Share</h1>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex space-x-4">
          {users.map((user, index) => (
            <div key={index} className="px-4 py-2 bg-blue-200 rounded">
              {user}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 border rounded">
          <Editor />
        </div>
        <div className="flex flex-col gap-4">
          <div className="border rounded flex-1">
            <Chat />
          </div>
          <div className="border rounded">
            <VideoCall />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <Buttons />
      </div>
    </div>
  );
};

export default Room;
