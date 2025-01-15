import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";

const SocketContext = createContext();

let socket;

export const SocketProvider = ({ children }) => {
  if (!socket) {
    console.log("Creating a new socket connection...");
    socket = io("http://localhost:5000", { withCredentials: true });
  }

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSocket = () => {
  return useContext(SocketContext);
};
