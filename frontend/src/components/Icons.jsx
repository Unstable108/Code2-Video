// https://unpkg.com/browse/@heroicons/react@2.2.0/24/outline/
//https://heroicons.com/outline

import React from "react";
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  ClipboardDocumentIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";

const Icons = {
  StartVideo: (props) => <VideoCameraIcon {...props} />,
  StopVideo: (props) => <VideoCameraSlashIcon {...props} />,
  Unmute: (props) => <MicrophoneIcon {...props} />,
  Mute: (props) => <SpeakerXMarkIcon {...props} />,
  CopyRoomId: (props) => <ClipboardDocumentIcon {...props} />,
};

export default Icons;
