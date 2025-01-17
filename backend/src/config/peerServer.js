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

module.exports = { configurePeerServer };
