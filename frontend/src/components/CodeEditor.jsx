import { useState, useEffect } from "react";
import { useSocket } from "../context/socketContext";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState("// Write your code here...");
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      // Listen for content updates from other users in the room
      const handleEditorUpdate = ({ newContent }) => {
        setCode(newContent);
      };

      socket.on("update-editor", handleEditorUpdate);

      return () => {
        socket.off("update-editor", handleEditorUpdate);
      };
    }
  }, [socket]);

  const handleEditorChange = (value) => {
    setCode(value);

    if (socket && roomId) {
      socket.emit("editor-change", { roomId, newContent: value });
    }
  };

  return (
    <div className="h-full p-4">
      <Editor
        height="calc(100vh - 40px)"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
