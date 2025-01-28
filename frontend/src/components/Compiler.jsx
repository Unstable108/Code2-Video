import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Compiler = ({ code }) => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunCode = async () => {
    setLoading(true);
    setOutput("Compiling...");
    try {
      const { data } = await axios.post("http://localhost:5000/api/compile", {
        source_code: code,
        language_id: 63, // JavaScript
        stdin: "",
      });

      const { token, stdout, stderr } = data;

      if (stdout || stderr) {
        const decodedOutput = stdout
          ? atob(stdout)
          : stderr
          ? atob(stderr)
          : "No output";
        setOutput(decodedOutput);
        setLoading(false);
        return;
      }

      if (token) {
        const getResult = async () => {
          try {
            const result = await axios.get(
              `http://localhost:5000/api/compile/${token}`
            );
            const { stdout, stderr, status } = result.data;

            if (status.id <= 2) {
              setTimeout(getResult, 1000); // Poll every second if still processing
            } else {
              const decodedOutput =
                stdout || stderr ? stdout || stderr : "No output provided.";
              setOutput(decodedOutput);
              setLoading(false);
            }
          } catch (error) {
            console.error("Error fetching submission result:", error);
            setOutput("Error fetching result.");
            setLoading(false);
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
