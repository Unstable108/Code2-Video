import React from "react";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import VideoCall from "../components/VideoCall";
import Buttons from "../components/Buttons";

const RoomTest = ({ roomId, name }) => {
  return (
    <div className="h-screen w-full p-4 bg-gray-100 flex flex-col overflow-hidden">
      {/* Project Name */}
      <div className="text-center mb-2 border-b-2 border-gray-800 pb-2">
        <h1 className="text-3xl font-bold">Code-2-Share</h1>
      </div>

      {/* User List */}
      <div className="flex justify-center mb-2 border-b-2 border-gray-800 pb-2">
        <h3>unstable</h3>
      </div>

      {/* Main Layout */}
      <div className="flex-grow flex flex-col">
        {/* Upper Section: Code Editor and Chat */}
        <div className="flex flex-grow gap-2">
          {/* Code Editor (6x7) */}
          <div className="flex-[6] border-4 border-gray-700 p-2 overflow-auto">
            <CodeEditor />
          </div>

          {/* Chat Component (4x7) */}
          <div className="flex-[4] border-4 border-gray-700 p-2 overflow-auto">
            <Chat roomId={roomId} name={name} />
          </div>
        </div>

        {/* Lower Section: Buttons and Video */}
        <div className="flex gap-2 mt-2">
          {/* Buttons Component (1x3) */}
          <div className="flex flex-col items-center justify-start border-4 border-gray-700 p-2 h-full">
            <Buttons roomId={roomId} />
          </div>

          {/* Video Component (9x3) */}
          <div className="flex-grow border-4 border-gray-700 p-2 overflow-auto flex items-center justify-center">
            <VideoCall />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTest;
