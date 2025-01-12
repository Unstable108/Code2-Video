// import React from "react";
// import Icons from "../components/Icons";

// const Buttons = ({ roomId }) => {
//   const copyToClipboard = () => {
//     if (roomId) {
//       navigator.clipboard.writeText(roomId).then(
//         () => alert("Room ID copied to clipboard!"),
//         (err) => alert("Failed to copy Room ID.")
//       );
//     } else {
//       alert("Room ID not available.");
//     }
//   };

//   return (
//     <div className="flex flex-col space-y-4">
//       <button className="p-3 bg-blue-500 text-white rounded-md flex items-center space-x-2">
//         <Icons.StartCamera className="h-6 w-6" />
//         {/* <span>Start Video</span> */}
//       </button>
//       <button className="p-3 bg-red-500 text-white rounded-md flex items-center space-x-2">
//         <Icons.LeaveRoom className="h-6 w-6" />
//         {/* <span>Leave Meeting</span> */}
//       </button>
//       <button
//         onClick={copyToClipboard}
//         className="p-3 bg-green-500 text-white rounded-md flex items-center space-x-2"
//       >
//         <Icons.CopyRoomId className="h-6 w-6" />
//         {/* <span>Copy Room-ID</span> */}
//       </button>
//     </div>
//   );
// };

// export default Buttons;

import React, { useState } from "react";
import Icons from "../components/Icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Buttons = ({ roomId }) => {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId).then(
        () => {
          setShowToast(true);
          toast.success("RoomLink Copied", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        },
        (err) => alert("Failed to copy Room ID.")
      );
    } else {
      alert("Room ID not available.");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <button className="p-3 bg-blue-500 text-white rounded-md flex items-center space-x-2">
        <Icons.StartCamera className="h-6 w-6" />
        {/* <span>Start Video</span> */}
      </button>
      <button className="p-3 bg-red-500 text-white rounded-md flex items-center space-x-2">
        <Icons.LeaveRoom className="h-6 w-6" />
        {/* <span>Leave Meeting</span> */}
      </button>
      <button
        onClick={copyToClipboard}
        className="p-3 bg-green-500 text-white rounded-md flex items-center space-x-2"
      >
        <Icons.CopyRoomId className="h-6 w-6" />
        {/* <span>Copy Room-ID</span> */}
      </button>
      <ToastContainer />
    </div>
  );
};

export default Buttons;
