const { rooms } = require("../controllers/roomController");

module.exports = (io, socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a room
  socket.on("join-room", ({ roomId, userName }) => {
    if (!rooms.has(roomId)) {
      console.log(`Room not found: ${roomId}`);
      socket.emit("error", { message: "Room not found" });
      return;
    }

    // Add user to the room
    const room = rooms.get(roomId);

    // Ensure the user is not already in the room
    if (room.users.find((user) => user.name === userName)) {
      console.log(`${userName} is already in the room`);
      return; // Don't add user again
    }

    room.users.push({ id: socket.id, name: userName });
    rooms.set(roomId, room);

    socket.join(roomId);
    console.log(`${userName} joined room: ${roomId}`);

    // Notify all users in the room about the new user
    io.to(roomId).emit("room-data", room.users);

    socket.on("editor-change", ({ roomId, newContent }) => {
      if (roomId) {
        console.log("Broadcasting editor change to room:", roomId);
        io.to(roomId).emit("update-editor", { newContent });
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`${userName} disconnected from room: ${roomId}`);
      const room = rooms.get(roomId);
      if (room) {
        room.users = room.users.filter((user) => user.id !== socket.id);
        if (room.users.length === 0) {
          rooms.delete(roomId); // Delete empty room
        } else {
          io.to(roomId).emit("room-data", room.users); // Update user list
        }
      }
    });

    socket.on("send-message", ({ roomId, message, sender }) => {
      if (rooms.has(roomId)) {
        const timestamp = new Date().toISOString();
        const messageData = { sender, message, timestamp };

        console.log(`Message from ${sender} in room ${roomId}: ${message}`);

        // Broadcast the message to all users in the room
        io.to(roomId).emit("receive-message", messageData);
      }
    });
  });
};
