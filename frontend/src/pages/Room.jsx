import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import VideoCall from "../components/VideoCall";
import Buttons from "../components/Buttons";
import UserList from "../components/UserList";

import { io } from "socket.io-client";
import { useSocket } from "../context/socketContext";

const Room = () => {
  const { id: roomId } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [users, setUsers] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && name) {
      // Emit 'join-room' event with roomId and userName
      socket.emit("join-room", { roomId, userName: name });

      // Listen for 'room-data' event
      const handleRoomData = (updatedUsers) => {
        setUsers(updatedUsers.map((user) => user.name));
      };

      socket.on("room-data", handleRoomData);

      return () => {
        // Cleanup listeners to prevent duplicates
        socket.off("room-data", handleRoomData);
        socket.removeAllListeners(); // Remove all listeners
      };
    }
  }, [socket, roomId, name]);

  return (
    <div className="h-screen p-4">
      <div className="text-center mb-4">
        {imageLoaded ? (
          <img
            src="..\images\Code2Video cutout.jpg"
            alt="Code-2-Share"
            className="mx-auto h-12"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        ) : (
          <h1 className="text-3xl font-bold">Code-2-Share</h1>
        )}
      </div>

      <div className="flex justify-center mb-4">
        <UserList users={users} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 border rounded">
          <Editor />
        </div>
        <div className="flex flex-col gap-4">
          <div className="border rounded flex-1">
            <Chat roomId={roomId} name={name} />
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
