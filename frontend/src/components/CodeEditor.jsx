import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useSocket } from "../context/socketContext";
import Editor from "@monaco-editor/react";
import { debounce } from "lodash";

const CodeEditor = ({ code, roomId, setSharedCode }) => {
  const [localCode, setLocalCode] = useState(code); // Initialize local code with prop
  const [language, setLanguage] = useState("javascript"); // Language state
  const { socket } = useSocket();

  // Update local code when the prop changes (from other users)
  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  const handleEditorChange = (value) => {
    setLocalCode(value);
    setSharedCode(value); // Set shared code immediately
  };

  const debouncedEmit = useCallback(
    debounce((newCode) => {
      if (socket && roomId) {
        socket.emit("editor-change", { roomId, newContent: newCode });
      }
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedEmit(localCode);
  }, [localCode, debouncedEmit]);

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
          value={localCode}
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
