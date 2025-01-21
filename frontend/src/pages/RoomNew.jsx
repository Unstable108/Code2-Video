import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import VideoCall from "../components/VideoCall";
import Buttons from "../components/Buttons";
import UserList from "../components/UserList";
import new_logo from "../images/new_logo.png";

import { useSocket } from "../context/socketContext";

const RoomNew = () => {
  const { id: roomId } = useParams();
  const location = useLocation();
  const { name } = location.state || {};
  const [users, setUsers] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && name) {
      socket.emit("join-room", { roomId, userName: name });

      const handleRoomData = (updatedUsers) => {
        setUsers(updatedUsers.map((user) => user.name));
      };

      socket.on("room-data", handleRoomData);

      return () => {
        socket.off("room-data", handleRoomData);
        socket.removeAllListeners();
      };
    }
  }, [socket, roomId, name]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}

      {/* <header className="flex justify-center items-center text-center p-4 flex-shrink-0">
        <img src={new_logo} alt="Code2`Video Logo" className="w-40 h-auto" />
      </header> */}

      <header className="text-center p-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold">Code2Video</h1>
      </header>

      {/* Reduced Size Div Below Header */}
      <section className="grid grid-cols-1 p-1 h-14 flex-shrink-0">
        <div className="h-full rounded bg-orange-500 shadow-xl overflow-hidden">
          {/* user component here */}
          <UserList users={users} />
        </div>
      </section>

      {/* Main Two-Grid Section */}
      <section className="grid grid-cols-1 sm:grid-cols-12 gap-1 p-2 flex-grow min-h-0">
        <div className="rounded bg-teal-500 shadow-xl sm:col-span-8 overflow-y-auto h-full">
          {/* codeEditor Component fits here */}
          <CodeEditor roomId={roomId} />
        </div>
        <div className="rounded bg-red-500 shadow-xl sm:col-span-4 overflow-y-auto h-full">
          <Chat roomId={roomId} name={name} />
        </div>
      </section>

      {/* Footer Section */}
      <footer className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 h-44 flex-shrink-0">
        {/* Buttons */}
        <div className="absolute bottom-0 left-0 rounded bg-orange-500 shadow-xl sm:col-span-1 flex items-center justify-center">
          <Buttons roomId={roomId} />
        </div>

        {/* Video Call */}
        <div className="rounded bg-teal-500 shadow-xl sm:col-span-11 overflow-hidden">
          <VideoCall roomId={roomId} />
        </div>
      </footer>
    </div>
  );
};

export default RoomNew;
