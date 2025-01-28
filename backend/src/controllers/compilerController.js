const express = require("express");
const axios = require("axios");
const router = express.Router();

// Judge0 API Configuration
const JUDGE0_API_BASE_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

// Compile Code Route
router.post("/", async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  // Encode inputs in Base64
  const encodedSourceCode = Buffer.from(
    source_code.replace(/\r\n/g, "\n"),
    "utf-8"
  ).toString("base64");

  console.log("Encoded Source Code:", encodedSourceCode);
  console.log(
    "Decoded Source Code:",
    Buffer.from(encodedSourceCode, "base64").toString("utf-8")
  );

  const encodedStdin = stdin
    ? Buffer.from(stdin, "utf-8").toString("base64")
    : null;

  try {
    const response = await axios.post(
      `${JUDGE0_API_BASE_URL}/submissions`,
      {
        source_code, // Send plain text, not Base64
        language_id,
        stdin,
        wait: true, // You can still wait for the result
      },
      {
        headers: {
          "X-RapidAPI-Host": "judge029.p.rapidapi.com",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);

    // Respond with Judge0's result
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Compilation error:", error.message);
    console.error("Compilation error:", error.response?.data || error.message);
    res.status(500).json({ message: "Error while compiling code", error });
  }
});

// Get submission result by token
router.get("/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const result = await axios.get(
      `${JUDGE0_API_BASE_URL}/submissions/${token}`,
      {
        headers: {
          "X-RapidAPI-Host": "judge029.p.rapidapi.com",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
        },
      }
    );

    res.status(200).json(result.data);
  } catch (error) {
    console.error("Error fetching submission result:", error.message);
    res.status(500).json({ message: "Error fetching result", error });
  }
});

module.exports = router;
