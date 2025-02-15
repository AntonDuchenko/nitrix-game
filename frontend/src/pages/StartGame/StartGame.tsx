import { Button } from "../../components/Button/Button";
import styles from "./StartGame.module.scss";
import { useNavigate } from "react-router";
import { useSocket } from "../../hooks/useSocket";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const StartGamePage = () => {
  const { connect, socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    socket?.on("joinedRoom", (data) => {
      Cookies.set("roomName", data.roomName);
      navigate("./play");
    });
  }, [socket]);

  const handleClick = () => {
    connect(import.meta.env.VITE_SOCKET_URL);
  };

  return (
    <div className={styles.game}>
      <Button onClick={handleClick} className={styles.playBtn}>
        Play
      </Button>
    </div>
  );
};
