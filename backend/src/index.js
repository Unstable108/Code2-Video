const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import custom modules
const { router: roomRoutes } = require("./controllers/roomController");
const compileRouter = require("./controllers/compilerController");
const socketHandler = require("./sockets/socketHandler");
const {
  configurePeerServer,
  createPeerServer,
} = require("./config/peerServer");

const app = express();
const server = http.createServer(app);

// Initialize PeerJS on a separate server
const peerApp = express();
const peerServer = http.createServer(peerApp);

//Create the PeerJS instance and configure it
const peerJsInstance = createPeerServer(peerApp, peerServer);
configurePeerServer(peerJsInstance);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/compile", compileRouter);

// Initialize Socket.io
const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: process.env.FRONTEND_URL,
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

// Determine environment (local vs production)
const isProduction = process.env.NODE_ENV === "production";

// Server Configuration
const PORT = process.env.PORT || 5000;
const PEER_PORT = process.env.PEER_PORT || (isProduction ? 443 : 5001);
const HOST = process.env.HOST || "0.0.0.0";

// Start the Express server
server.listen(PORT, HOST, () => {
  const environmentUrl =
    process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`;
  console.log(`Server running on ${environmentUrl}`);
});

// Start the PeerJS server
peerServer.listen(PEER_PORT, HOST, () => {
  console.log(
    `PeerJS Server running on ${
      isProduction ? "HTTPS" : "HTTP"
    }://${HOST}:${PEER_PORT}`
  );
});
