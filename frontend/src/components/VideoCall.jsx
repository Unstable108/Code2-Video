import { useEffect, useRef } from "react";
import { useSocket } from "../context/socketContext";
import { useParams } from "react-router-dom";
import Peer from "peerjs";

const VideoCall = () => {
  const { socket } = useSocket();
  const { id: roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef(null);
  const peerInstance = useRef(null);
  const peers = useRef({}); // Store active peer connections

  useEffect(() => {
    const initializePeerAndMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Attach local stream to video element
        if (localVideoRef.current && !localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.muted = true;
          localVideoRef.current.play().catch((error) => {
            console.error("Error playing local video:", error);
          });
        }

        // Initialize PeerJS
        if (!peerInstance.current) {
          peerInstance.current = new Peer(undefined, {
            host: "localhost",
            port: 5001,
            path: "/peerjs",
          });

          peerInstance.current.on("open", (peerId) => {
            socket.emit("join-video", { roomId, peerId });
          });

          // Handle incoming calls
          peerInstance.current.on("call", (call) => {
            call.answer(localStream);
            call.on("stream", (remoteStream) => {
              addRemoteStream(call.peer, remoteStream);
            });

            call.on("close", () => {
              removeRemoteStream(call.peer);
            });
          });
        }

        // Listen for new peers
        socket.on("new-peer", ({ peerId }) => {
          if (peers.current[peerId]) return; // Avoid duplicate calls
          const call = peerInstance.current.call(peerId, localStream);
          call.on("stream", (remoteStream) => {
            addRemoteStream(peerId, remoteStream);
          });

          call.on("close", () => {
            removeRemoteStream(peerId);
          });

          peers.current[peerId] = call;
        });

        // Handle existing peers
        socket.on("existing-peers", ({ existingPeers }) => {
          existingPeers.forEach((peerId) => {
            if (peers.current[peerId]) return;
            const call = peerInstance.current.call(peerId, localStream);
            call.on("stream", (remoteStream) => {
              addRemoteStream(peerId, remoteStream);
            });

            call.on("close", () => {
              removeRemoteStream(peerId);
            });

            peers.current[peerId] = call;
          });
        });

        // Handle peer disconnection
        socket.on("peer-disconnected", ({ peerId }) => {
          removeRemoteStream(peerId);
        });
      } catch (error) {
        console.error("Error initializing video:", error);
      }
    };

    const addRemoteStream = (peerId, remoteStream) => {
      const existingVideo = remoteVideosRef.current.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      if (existingVideo) return; // Prevent duplicate video elements

      const videoElement = document.createElement("video");
      videoElement.srcObject = remoteStream;
      videoElement.autoplay = true;
      videoElement.dataset.peerId = peerId;
      videoElement.className = "remote-video w-32 h-32 m-2";
      remoteVideosRef.current.appendChild(videoElement);
    };

    const removeRemoteStream = (peerId) => {
      const videoElement = remoteVideosRef.current.querySelector(
        `[data-peer-id="${peerId}"]`
      );
      if (videoElement) {
        videoElement.remove();
      }
      delete peers.current[peerId];
    };

    const cleanup = () => {
      // Close all active peer connections
      Object.values(peers.current).forEach((call) => call.close());
      peers.current = {};

      // Clear remote videos
      if (remoteVideosRef.current) {
        while (remoteVideosRef.current.firstChild) {
          remoteVideosRef.current.removeChild(
            remoteVideosRef.current.firstChild
          );
        }
      }

      // Destroy PeerJS instance
      if (peerInstance.current) {
        peerInstance.current.destroy();
        peerInstance.current = null;
      }

      // Remove all socket listeners for this room
      socket.off("new-peer");
      socket.off("existing-peers");
      socket.off("peer-disconnected");
    };

    initializePeerAndMedia();

    return cleanup; // Cleanup when component unmounts
  }, [socket, roomId]);

  return (
    <div className="video-call-container">
      <div className="local-video-container">
        <video
          ref={localVideoRef}
          className="w-48 h-48 border-4 border-blue-500"
        />
      </div>
      <div
        ref={(el) => (remoteVideosRef.current = el)}
        className="remote-videos flex flex-wrap"
      ></div>
    </div>
  );
};

export default VideoCall;
