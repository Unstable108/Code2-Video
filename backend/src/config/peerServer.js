function configurePeerServer(peerServer) {
  peerServer.on("connection", (client) => {
    console.log(`Peer connected: ${client.getId()}`);
  });

  peerServer.on("disconnect", (client) => {
    console.log(`Peer disconnected: ${client.getId()}`);
  });
}

module.exports = { configurePeerServer };
