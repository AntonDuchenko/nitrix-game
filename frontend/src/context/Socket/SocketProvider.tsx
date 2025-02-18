import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./SocketContext";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import Cookies from "js-cookie";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      const roomName = Cookies.get("roomName");

      if (roomName) {
        connect(import.meta.env.VITE_SOCKET_URL);
      } else {
        navigate("/game", { replace: true });
      }
    }
  }, [isConnected]);

  const connect = useCallback(
    (url: string) => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      const token = Cookies.get("auth_token");

      socketRef.current = io(url, {
        auth: {
          token,
        },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        const roomName = Cookies.get("roomName");

        if (roomName) {
          socketRef.current?.emit("reconnectRoom", {
            room: roomName,
          });
        } else {
          socketRef.current?.emit("joinRoom");
        }

        console.log("connected");
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        console.log("disconnected");
        setIsConnected(false);
      });
    },
    [isConnected]
  );

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connect,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
