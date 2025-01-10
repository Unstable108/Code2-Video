// Icons.jsx
import React from "react";
import {
  CameraIcon,
  ClipboardDocumentIcon,
  ArrowRightOnRectangleIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/solid";

const Icons = {
  StartCamera: (props) => <CameraIcon {...props} />,
  StopCamera: (props) => <VideoCameraSlashIcon {...props} />,
  CopyRoomId: (props) => <ClipboardDocumentIcon {...props} />,
  LeaveRoom: (props) => <ArrowRightOnRectangleIcon {...props} />,
};

export default Icons;
