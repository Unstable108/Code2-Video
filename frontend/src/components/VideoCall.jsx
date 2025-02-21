import { useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/socketContext";
import { useParams } from "react-router-dom";
import Peer from "peerjs";

const VideoCall = ({ users, isVideoOn, isMicOn }) => {
  const { socket } = useSocket();
  const { id: roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef(null);
  const peerInstance = useRef(null);
  const peers = useRef({}); // Store active peer connections
  const userNames = useRef({}); // Map peer IDs to user names
  const localStreamRef = useRef(null);

  useEffect(() => {
    const initializePeerAndMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoOn,
          audio: isMicOn,
        });

        // Attach local stream to video element
        if (localVideoRef.current && !localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.muted = true;
          await localVideoRef.current.play().catch((error) => {
            console.error("Error playing local video:", error);
          });
        }

        // Initialize PeerJS
        if (!peerInstance.current) {
          peerInstance.current = new Peer(undefined, {
            host: import.meta.env.VITE_PEER_HOST,
            secure: import.meta.env.VITE_PEER_SECURE === "true",
            port: Number(import.meta.env.VITE_PEER_PORT),
            path: "/peerjs",
          });

          peerInstance.current.on("open", (peerId) => {
            console.log("PeerJS connected:", peerId); // Debugging log
            socket.emit("join-video", { roomId, peerId });
          });

          // Handle incoming calls
          peerInstance.current.on("call", (call) => {
            console.log("Incoming call from:", call.peer); // Debugging log
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
        socket.on("new-peer", ({ peerId, userName }) => {
          console.log("New peer joined:", peerId); // Debugging log
          if (peers.current[peerId]) return; // Avoid duplicate calls
          userNames.current[peerId] = userName;
          const call = peerInstance.current.call(peerId, localStream);
          call.on("stream", (remoteStream) => {
            addRemoteStream(peerId, remoteStream, userName);
          });

          call.on("close", () => {
            removeRemoteStream(peerId);
          });

          peers.current[peerId] = call;
        });

        // Handle existing peers
        socket.on("existing-peers", ({ existingPeers }) => {
          console.log("Existing peers:", existingPeers); // Debugging log
          existingPeers.forEach(({ peerId, userName }) => {
            if (peers.current[peerId]) return;
            userNames.current[peerId] = userName;
            const call = peerInstance.current.call(peerId, localStream);
            call.on("stream", (remoteStream) => {
              addRemoteStream(peerId, remoteStream, userName);
            });

            call.on("close", () => {
              removeRemoteStream(peerId);
            });

            peers.current[peerId] = call;
          });
        });

        // Handle peer disconnection
        socket.on("peer-disconnected", ({ peerId }) => {
          console.log("Peer disconnected:", peerId); // Debugging log
          removeRemoteStream(peerId);
        });
      } catch (error) {
        console.error("Error initializing video:", error);
      }
    };

    const cleanup = () => {
      // Close all active peer connections
      Object.values(peers.current).forEach((call) => {
        call.close();
        console.log("Closed call to:", call.peer); // Debugging log
      });
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

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = isVideoOn));
      localStreamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = isMicOn));
    }
  }, [isVideoOn, isMicOn]);

  const addRemoteStream = useCallback((peerId, remoteStream, userName) => {
    const existingVideo = remoteVideosRef.current.querySelector(
      `[data-peer-id="${peerId}"]`
    );
    if (existingVideo) return; // Prevent duplicate video elements

    const container = document.createElement("div");
    container.className = "video-container flex flex-col items-center m-2";
    container.dataset.peerId = peerId;

    const videoElement = document.createElement("video");
    videoElement.srcObject = remoteStream;
    videoElement.autoplay = true;
    videoElement.muted = true; // Ensure remote video is muted
    videoElement.className =
      "remote-video w-48 h-48 border-2 border-gray-400 object-cover rounded-lg";

    container.appendChild(videoElement);

    remoteVideosRef.current.appendChild(container);
    console.log(`Added remote stream for peer ${peerId}`); // Debugging log
  }, []);

  const removeRemoteStream = useCallback((peerId) => {
    const videoElement = remoteVideosRef.current.querySelector(
      `[data-peer-id="${peerId}"]`
    );
    if (videoElement) {
      videoElement.remove();
    }
    delete peers.current[peerId];
    delete userNames.current[peerId];
    console.log(`Removed remote stream for peer ${peerId}`); // Debugging log
  }, []);

  return (
    <div className="video-call-container overflow-x-auto whitespace-nowrap flex items-start">
      <div className="local-video-container flex-shrink-0">
        <div className="video-container flex flex-col items-center m-2">
          <video
            ref={localVideoRef}
            className="w-48 h-48 border-2 border-gray-400 object-cover rounded-lg"
            autoPlay
            muted
          />
        </div>
      </div>
      <div
        ref={(el) => (remoteVideosRef.current = el)}
        className="remote-videos flex items-start"
      ></div>
    </div>
  );
};

export default VideoCall;
