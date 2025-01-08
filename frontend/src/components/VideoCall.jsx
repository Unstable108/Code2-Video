import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";

const VideoCall = ({ roomId, name }) => {
  const [peerId, setPeerId] = useState("");
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const socket = useRef();
  const peerRef = useRef();
  const videoGridRef = useRef();

  useEffect(() => {
    // Initialize Socket.io
    socket.current = io("http://localhost:5000");

    // Initialize PeerJS
    const peer = new Peer(undefined, {
      host: "localhost",
      port: 5001,
      path: "/peerjs",
    });

    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log(`Peer ID: ${id}`);
      setPeerId(id);

      // Notify the room about this peer
      socket.current.emit("join-room", { roomId, userName: name, peerId: id });
    });

    peer.on("call", (call) => {
      console.log("Incoming call...");
      call.answer(stream);

      call.on("stream", (peerStream) => {
        addVideoStream(peerStream);
      });
    });

    socket.current.on("user-connected", ({ peerId: newPeerId }) => {
      console.log(`User connected: ${newPeerId}`);
      connectToNewUser(newPeerId, stream);
    });

    return () => {
      socket.current.disconnect();
      peer.destroy();
    };
  }, [roomId, name, stream]);

  const startMediaStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(localStream);
      addVideoStream(localStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const connectToNewUser = (peerIdToCall, stream) => {
    const call = peerRef.current.call(peerIdToCall, stream);

    call.on("stream", (peerStream) => {
      addVideoStream(peerStream);
    });

    call.on("close", () => {
      console.log(`Call with ${peerIdToCall} ended`);
    });
  };

  const addVideoStream = (peerStream) => {
    const videoElement = document.createElement("video");
    videoElement.srcObject = peerStream;
    videoElement.autoplay = true;
    videoElement.className = "w-full h-full object-cover";
    videoGridRef.current.appendChild(videoElement);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Video Call</h2>
      <div
        ref={videoGridRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      ></div>
      <div className="mt-4">
        <button
          onClick={startMediaStream}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Video
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
