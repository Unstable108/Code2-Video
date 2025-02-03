import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { debounce } from "lodash";
import CodeEditor from "../components/CodeEditor";
import Compiler from "../components/Compiler";
import VideoCall from "../components/VideoCall";
import Buttons from "../components/Buttons";
import UserList from "../components/UserList";
import ChatIcon2 from "../components/ChatBots/ChatIcon2"; // Floating Chat
import Chat from "../components/Chat"; // Main Chat for large screens

import { useSocket } from "../context/socketContext";

const Room = () => {
  const { id: roomId } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [users, setUsers] = useState([]);
  const [sharedCode, setSharedCode] = useState("// Write your code here..."); // Centralized code state
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && name) {
      socket.emit("join-room", { roomId, userName: name });

      const handleRoomData = (updatedUsers) => {
        setUsers(updatedUsers.map((user) => user.name));
      };

      // When joining, get the initial code for the room (if any)
      socket.on("update-editor", ({ newContent }) => {
        setSharedCode(newContent); // Update shared code on initial load
      });

      socket.on("room-data", handleRoomData);

      return () => {
        socket.off("room-data", handleRoomData);
        socket.off("new-peer");
        socket.removeAllListeners();
      };
    }
  }, [socket, roomId, name]);

  return (
    <div className="h-screen w-full p-4 bg-gray-100 flex flex-col overflow-hidden">
      {/* Project Name */}
      <div className="text-center mb-2 border-b-2 border-gray-800 pb-2">
        <h1 className="text-3xl font-bold">Code-2-Share</h1>
      </div>

      {/* User List */}
      <div className="flex justify-center mb-2 border-b-2 border-gray-800 pb-2">
        <UserList users={users} />
      </div>

      {/* Main Layout */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Upper Section: Code Editor + Chat + Compiler */}
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-12 gap-2 overflow-hidden">
          {/* Code Editor */}
          <div className="rounded sm:col-span-8 border-2 border-gray-700 overflow-hidden">
            <div className="h-full w-full">
              <CodeEditor
                roomId={roomId}
                code={sharedCode}
                setSharedCode={setSharedCode}
              />
            </div>
          </div>

          {/* Right Section: Chat & Compiler (Side-by-Side on Large Screens) */}
          <div className="rounded sm:col-span-4 border-2 border-gray-700 overflow-hidden flex flex-col">
            <div className="h-1/2 border-b border-gray-700 hidden sm:flex">
              <Chat roomId={roomId} name={name} />
            </div>
            <div className="h-1/2 hidden sm:flex">
              <Compiler code={sharedCode} roomId={roomId} />
            </div>
          </div>
        </div>

        {/* Lower Section: Buttons and Video */}
        <div className="flex gap-1 mt-2 ">
          {/* Buttons Component */}
          <div className="flex flex-col items-center justify-start border-2 border-gray-700 p-2">
            <Buttons
              roomId={roomId}
              isVideoOn={isVideoOn}
              setIsVideoOn={setIsVideoOn}
              isMicOn={isMicOn}
              setIsMicOn={setIsMicOn}
            />
          </div>

          {/* Video Component */}
          <div className="flex-grow border-2 border-gray-700 p-2 overflow-auto">
            <VideoCall users={users} isVideoOn={isVideoOn} isMicOn={isMicOn} />
          </div>
        </div>
      </div>

      {/* Floating Chat for Mobile */}
      {/* <ChatIcon2 /> */}
    </div>
  );
};

export default Room;
