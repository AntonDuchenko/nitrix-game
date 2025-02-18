import { useNavigate } from "react-router";
import { useSocket } from "../../../../hooks/useSocket";
import { StartGameView } from "../views/StartGameView";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const StartGameController = () => {
  const { connect } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("roomName")) {
      navigate("./play");
    }
  }, []);

  const handleClick = () => {
    connect(import.meta.env.VITE_SOCKET_URL);
    navigate("./play");
  };

  return <StartGameView handleClick={handleClick} />;
};
