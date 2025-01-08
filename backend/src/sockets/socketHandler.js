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
    room.users.push({ id: socket.id, name: userName });
    rooms.set(roomId, room);

    socket.join(roomId);
    console.log(`${userName} joined room: ${roomId}`);

    // Notify all users in the room about the new user
    io.to(roomId).emit("room-data", room.users);

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`${userName} disconnected from room: ${roomId}`);

      // Remove the user from the room
      const updatedRoom = rooms.get(roomId);
      updatedRoom.users = updatedRoom.users.filter(
        (user) => user.id !== socket.id
      );
      rooms.set(roomId, updatedRoom);

      // Notify remaining users
      io.to(roomId).emit("room-data", updatedRoom.users);
    });
  });
};
