import { useContext } from "react";
import { SocketContext } from "../context/Socket/SocketContext";

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within an ScoketProvider");
  }
  return context;
};
