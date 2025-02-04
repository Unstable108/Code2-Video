const { ExpressPeerServer } = require("peer");

function configurePeerServer(peerServer) {
  peerServer.on("connection", (client) => {
    console.log(`Peer connected: ${client.getId()}`);
  });

  peerServer.on("disconnect", (client) => {
    console.log(`Peer disconnected: ${client.getId()}`);
  });

  peerServer.on("error", (err) => {
    console.error("Peer server error:", err);
  });
}

function createPeerServer(peerApp, peerServer) {
  const peerJsInstance = ExpressPeerServer(peerServer, {
    debug: true,
    allow_discovery: true,
  });

  // Set CORS headers for PeerJS
  peerApp.use("/peerjs", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  peerApp.use("/peerjs", peerJsInstance);

  return peerJsInstance;
}

module.exports = { configurePeerServer, createPeerServer };
