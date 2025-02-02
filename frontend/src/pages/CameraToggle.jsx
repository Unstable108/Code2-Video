//https://stackoverflow.com/questions/64012898/how-to-completely-turn-off-camera-on-mediastream-javascript
import React, { useState, useEffect, useRef } from "react";

function CameraToggle() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const toggleCamera = async () => {
    if (isCameraOn) {
      // Stop the camera
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
      setIsCameraOn(false);
    } else {
      // Start the camera
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setIsCameraOn(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert(
          "Error accessing camera. Please make sure you have granted permission."
        );
      }
    }
  };

  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        const permissions = await navigator.permissions.query({
          name: "camera",
        });
        if (permissions.state === "granted") {
          setIsCameraOn(true);
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        } else if (permissions.state === "prompt") {
          //User has not yet been asked for access
        } else {
          alert(
            "Camera access was previously denied. Please enable it in your browser settings."
          );
        }
      } catch (error) {
        console.error("Error checking camera permissions:", error);
      }
    };

    checkCameraPermissions();

    return () => {
      // Cleanup on unmount (important!)
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and unmount

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={toggleCamera}>
        {isCameraOn ? "Stop Camera" : "Start Camera"}
      </button>
    </div>
  );
}

export default CameraToggle;
