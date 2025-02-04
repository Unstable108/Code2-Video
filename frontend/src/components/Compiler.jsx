import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useSocket } from "../context/socketContext";

const Compiler = ({ roomId, code }) => {
  const { socket } = useSocket();
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Receive compiler output updates
    socket.on("compiler-output", ({ output }) => {
      setOutput(output);
      setLoading(false);
    });

    // Receive compile status
    socket.on("compiler-status", ({ status }) => {
      setOutput(status);
      setLoading(status === "Compiling...");
    });

    return () => {
      socket.off("compiler-output");
      socket.off("compiler-status");
    };
  }, [socket]);

  const handleRunCode = async () => {
    if (!code || code.trim() === "") {
      setOutput("Error: No code to compile.");
      return;
    }

    setLoading(true);
    setOutput("Compiling...");

    // Notify others that compilation is in progress
    socket.emit("compiler-status", { roomId, status: "Compiling..." });

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/compile`,
        {
          source_code: code, // Ensure the latest code is sent
          language_id: 63, // JavaScript
          stdin: "",
        }
      );

      const { token, stdout, stderr } = data;

      if (stdout || stderr) {
        const decodedOutput = stdout
          ? atob(stdout)
          : stderr
          ? atob(stderr)
          : "No output";
        setOutput(decodedOutput);
        setLoading(false);

        // Broadcast output to other users
        socket.emit("compiler-output", { roomId, output: decodedOutput });
        return;
      }

      if (token) {
        const getResult = async () => {
          try {
            const result = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/compile/${token}`
            );
            const { stdout, stderr, status } = result.data;

            if (status.id <= 2) {
              setTimeout(getResult, 1000); // Poll every second if still processing
            } else {
              const decodedOutput =
                stdout || stderr ? stdout || stderr : "No output provided.";
              setOutput(decodedOutput);
              setLoading(false);

              // Broadcast output to other users
              socket.emit("compiler-output", { roomId, output: decodedOutput });
            }
          } catch (error) {
            console.error("Error fetching submission result:", error);
            setOutput("Error fetching result.");
            setLoading(false);
            socket.emit("compiler-output", {
              roomId,
              output: "Error running code.",
            });
          }
        };

        await getResult();
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error running code.");
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Run Code Button */}
      <div className="p-2">
        <button
          onClick={handleRunCode}
          className="w-full p-2 bg-blue-500 text-white rounded-md"
          disabled={loading}
        >
          {loading ? "Compiling..." : "Compile Code"}
        </button>
      </div>

      {/* Output Section */}
      <div className="flex-grow bg-gray-900 text-white p-4 mt-2 overflow-auto rounded-md">
        <strong>Output:</strong>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
};

Compiler.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Compiler;
