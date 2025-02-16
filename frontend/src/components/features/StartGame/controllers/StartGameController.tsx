import { useNavigate } from "react-router";
import { useSocket } from "../../../../hooks/useSocket";
import { StartGameView } from "../views/StartGameView";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const StartGameController = () => {
  const { connect, socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    socket?.on("joinedRoom", (data) => {
      Cookies.set("roomName", data.roomName);
      navigate("./play");
    });
  }, [socket]);

  useEffect(() => {
    if (Cookies.get("roomName")) {
      navigate("./play");
    }
  }, []);

  const handleClick = () => {
    connect(import.meta.env.VITE_SOCKET_URL);
  };

  return <StartGameView handleClick={handleClick} />;
};
