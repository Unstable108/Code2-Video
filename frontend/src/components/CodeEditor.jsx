import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSocket } from "../context/socketContext";
import Editor from "@monaco-editor/react";
import { debounce } from "lodash";

const CodeEditor = ({ roomId, onCodeChange }) => {
  const [code, setCode] = useState("// Write your code here...");
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
    <div className="h-full w-full shadow-xl overflow-hidden">
      <Editor
        height="100%" // Ensure editor takes 100% of its allocated height
        width="100%" // Ensure the editor takes the full width of its parent container
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true, // Automatically adjust layout
        }}
      />
    </div>
  );
};

CodeEditor.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default CodeEditor;
