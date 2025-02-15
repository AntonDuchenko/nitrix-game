import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Player } from "../../components/Player/Player";
import { BodyParts, IEntity } from "../../types";
import styles from "./Game.module.scss";
import { useSocket } from "../../hooks/useSocket";
import { Loader } from "../../components/Loader/Loader";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

export const Game = () => {
  const { socket } = useSocket();
  const [attackBodyPart, setAttackBodyPart] = useState<BodyParts | null>(null);
  const [defendBodyPart, setDefendBodyPart] = useState<BodyParts | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [myHealth, setMyHealth] = useState(10);
  const [opponentHealth, setOpponentHealth] = useState(10);
  const navigate = useNavigate();
  const id = Cookies.get("userId");

  useEffect(() => {
    socket?.on("startGame", (data) => {
      setMyHealth(
        data.players.find(
          (player: { id: string; type: string; health: number }) =>
            player.id === id
        ).health
      );

      setOpponentHealth(
        data.players.find(
          (player: { id: string; type: string; health: number }) =>
            player.id !== id
        ).health
      );

      setGameStarted(true);
    });
  }, [socket, id]);

  useEffect(() => {
    const handleEntityUpdated = (data: IEntity[]) => {
      data.forEach((entity) => {
        if (entity.entityId === id) {
          setMyHealth(entity.updates.health);
        } else {
          setOpponentHealth(entity.updates.health);
        }
      });

      setAttackBodyPart(null);
      setDefendBodyPart(null);
      setIsWaiting(false);
    };

    socket?.on("entityUpdated", handleEntityUpdated);

    return () => {
      socket?.off("entityUpdated", handleEntityUpdated);
    };
  }, [socket, id]);

  useEffect(() => {
    socket?.on("reconnectError", () => {
      Cookies.remove("roomName");
      navigate("/game", { replace: true });
    });
  }, [socket]);

  const handleChangeAttackBodyPart = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAttackBodyPart(event.target.value as BodyParts);
  };

  const handleChangeDefendBodyPart = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDefendBodyPart(event.target.value as BodyParts);
  };

  const handleQuit = () => {
    socket?.disconnect();
    Cookies.remove("roomName");
    navigate("/game", { replace: true });
  };

  const handleAttack = () => {
    socket?.emit("attack", {
      roomName: Cookies.get("roomName"),
      actions: {
        attack: attackBodyPart,
        defend: defendBodyPart,
      },
    });

    setIsWaiting(true);
  };

  return (
    <div className={styles.game}>
      {!gameStarted ? (
        <div className={styles.position}>
          You are alone in the queue. Please wait your opponent.
          <Loader />
          <Button className={styles.quitBtn} onClick={handleQuit}>
            Quit
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.players}>
            <Player
              health={myHealth}
              name="defender"
              onChangeBodyPart={handleChangeDefendBodyPart}
              bodyPart={defendBodyPart}
            />

            <Player
              health={opponentHealth}
              name="attacker"
              onChangeBodyPart={handleChangeAttackBodyPart}
              bodyPart={attackBodyPart}
            />
          </div>

          <Button
            onClick={handleAttack}
            disabled={!attackBodyPart || !defendBodyPart || isWaiting}
            className={styles.attackBtn}
          >
            {isWaiting ? "Waiting for your opponent" : "Attack"}
          </Button>
        </>
      )}
    </div>
  );
};
