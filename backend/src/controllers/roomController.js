const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const rooms = new Map(); // In-memory storage for room data

// Create a new room
router.post("/create", (req, res) => {
  const roomId = uuidv4();
  rooms.set(roomId, { users: [], code: "// Write your code here..." }); // Initialize with an empty array of users
  res.status(201).json({ roomId });
});

// Get room details
router.get("/:roomId", (req, res) => {
  const { roomId } = req.params;
  if (rooms.has(roomId)) {
    res.status(200).json({
      roomId,
      users: rooms.get(roomId).users,
      code: rooms.get(roomId).code,
    });
  } else {
    res.status(404).json({ message: "Room not found" });
  }
});

// Export the rooms map for use in socketHandlers.js
module.exports = { router, rooms };
