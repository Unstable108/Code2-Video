import { useState } from "react";
import Icons from "../components/Icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const Buttons = ({ roomId }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const copyToClipboard = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId).then(
        () => {
          toast.success("Room Link Copied", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        },
        (err) => {
          alert("Failed to copy Room ID.");
          console.error(err);
        }
      );
    } else {
      alert("Room ID not available.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <button
        onClick={() => setIsVideoOn(!isVideoOn)}
        className="p-3 bg-blue-500 text-white rounded-md flex items-center space-x-2 hover:bg-blue-600 transition"
      >
        {isVideoOn ? (
          <Icons.StartVideo className="h-6 w-6" />
        ) : (
          <Icons.StopVideo className="h-6 w-6" />
        )}
      </button>
      <button
        onClick={() => setIsMicOn(!isMicOn)}
        className="p-3 bg-purple-500 text-white rounded-md flex items-center space-x-2 hover:bg-purple-600 transition"
      >
        {isMicOn ? (
          <Icons.Unmute className="h-6 w-6" />
        ) : (
          <Icons.Mute className="h-6 w-6" />
        )}
      </button>
      <button
        onClick={copyToClipboard}
        className="p-3 bg-green-500 text-white rounded-md flex items-center space-x-2 hover:bg-green-600 transition"
      >
        <Icons.CopyRoomId className="h-6 w-6" />
      </button>
      <ToastContainer />
    </div>
  );
};

Buttons.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default Buttons;
