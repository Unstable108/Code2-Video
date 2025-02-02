import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSocket } from "../context/socketContext";
import Editor from "@monaco-editor/react";
import { debounce } from "lodash";

const CodeEditor = ({ roomId, onCodeChange }) => {
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript"); // Language state
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Listen for content updates from other users
      const handleEditorUpdate = ({ newContent }) => {
        setCode(newContent);
      };

      // When joining, get the initial code for the room
      socket.on("update-editor", handleEditorUpdate);

      return () => {
        socket.off("update-editor", handleEditorUpdate);
      };
    }
  }, [socket]);

  const handleEditorChange = debounce((value) => {
    setCode(value);
    onCodeChange(value); // Notify parent about code changes
    if (socket && roomId) {
      socket.emit("editor-change", { roomId, newContent: value });
    }
  }, 1000);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Navbar */}
      <div className="flex justify-between items-center p-1 bg-gray-800 text-white">
        <div className="flex items-center gap-2 ml-1">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-1 bg-gray-700 rounded text-white text-xs"
          >
            <option value="javascript">JS</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mr-1">
          <button className="px-2 py-1 bg-blue-500 rounded text-xs">Run</button>
          <button className="px-2 py-1 bg-red-500 rounded text-xs">Stop</button>
          <button className="px-2 py-1 bg-green-500 rounded text-xs">
            Save
          </button>
          <button className="px-2 py-1 bg-yellow-500 rounded text-xs">
            Beautify
          </button>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-grow">
        <Editor
          height="100%" // Takes up the remaining height in the container
          width="100%" // Takes up the full width
          language={language} // Dynamically set the language
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true, // Automatically adjust layout
          }}
        />
      </div>
    </div>
  );
};

CodeEditor.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default CodeEditor;
