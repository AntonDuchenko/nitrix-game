import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SocketContext } from "./SocketContext";
import Cookies from "js-cookie";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();
  const roomName = Cookies.get("roomName");

  useEffect(() => {
    if (!isConnected) {
      if (roomName) {
        connect(import.meta.env.VITE_SOCKET_URL);
      } else {
        navigate("/game", { replace: true });
      }
    }
  }, [isConnected]);

  const connect = useCallback(
    (url: string) => {
      if (isConnected) return;

      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        if (socketRef.current) {
          if (roomName) {
            socketRef.current.send(JSON.stringify({ type: "reconnectRoom" }));
          } else {
            socketRef.current.send(JSON.stringify({ type: "joinRoom" }));
          }

          console.log("connected");
          setIsConnected(true);
        }
      };

      socketRef.current.onclose = () => {
        console.log("disconnected");
        setIsConnected(false);
      };
    },
    [isConnected, roomName]
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
