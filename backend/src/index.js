const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");
const path = require("path");

// Import custom modules
const { router: roomRoutes } = require("./controllers/roomController");
const socketHandler = require("./sockets/socketHandler");
const { configurePeerServer } = require("./config/peerServer");

const app = express();
const server = http.createServer(app);

// Initialize PeerJS on a separate server
const peerApp = express();
const peerServer = http.createServer(peerApp);
const peerJsInstance = ExpressPeerServer(peerServer, { debug: true });
peerApp.use("/peerjs", peerJsInstance);
configurePeerServer(peerJsInstance);

// Middleware
app.use(
  cors({
    origin: [
      "https://code2-video.vercel.app", // Frontend on Vercel
      "http://localhost:5173", // Frontend for local testing
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/rooms", roomRoutes);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "https://code2-video.vercel.app", // Frontend on Vercel
      "http://localhost:5173", // Local testing
    ],
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socketHandler(io, socket);
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
  });
});

// Start the servers
const PORT = process.env.PORT || 5000;
const PEER_PORT = process.env.PEER_PORT || 5001;

server.listen(PORT, () => {
  const host = process.env.HOST || "0.0.0.0"; // Use HOST if set, otherwise default
  const environmentUrl = process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`;
  console.log(`Server running on ${environmentUrl}`);
});

peerServer.listen(PEER_PORT, () => {
  const peerUrl = `http://localhost:${PEER_PORT}`;
  console.log(`PeerJS Server running on ${peerUrl}`);
});
