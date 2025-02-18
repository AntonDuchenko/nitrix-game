import { useEffect, useState } from "react";
import { useSocket } from "../../../../hooks/useSocket";
import { GameView } from "../views/GameView";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { BodyParts, ILog, IUpdateDto } from "../types/game.types";

const MAX_HEALTH = 10;

export const GameController = () => {
  const { socket } = useSocket();
  const [attackBodyPart, setAttackBodyPart] = useState<BodyParts | null>(null);
  const [defendBodyPart, setDefendBodyPart] = useState<BodyParts | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [myHealth, setMyHealth] = useState(MAX_HEALTH);
  const [opponentHealth, setOpponentHealth] = useState(MAX_HEALTH);
  const [myDamageGotten, setMyDamageGotten] = useState<number | null>(null);
  const [opponentDamageGotten, setOpponentDamageGotten] = useState<
    number | null
  >(null);
  const [logs, setLogs] = useState<ILog[]>([]);
  const [isWinner, setIsWinner] = useState<boolean | null | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const id = Cookies.get("userId");

  useEffect(() => {
    socket?.on("startGame", (data) => {
      console.log("startGame");
      
      if (data.turn) {
        setAttackBodyPart(data.turn.attack as BodyParts);
        setDefendBodyPart(data.turn.defend as BodyParts);
        setIsWaiting(true);
      }
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

    return () => {
      socket?.off("startGame");
    };
  }, [socket, id]);

  useEffect(() => {
    socket?.on("entityUpdated", (data: IUpdateDto) => {
      data.entities.forEach((entity) => {
        if (entity.entityId === id) {
          setMyDamageGotten(myHealth - entity.updates.health);
          setMyHealth(entity.updates.health);
        } else {
          setOpponentDamageGotten(opponentHealth - entity.updates.health);
          setOpponentHealth(entity.updates.health);
        }
      });

      setLogs(data.log);

      setAttackBodyPart(null);
      setDefendBodyPart(null);
      setIsWaiting(false);
    });

    return () => {
      socket?.off("entityUpdated");
    };
  }, [socket, id, myHealth, opponentHealth]);

  useEffect(() => {
    socket?.on("reconnectError", () => {
      Cookies.remove("roomName");
      navigate("/game", { replace: true });
    });

    return () => {
      socket?.off("reconnectError");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("gameOver", (data) => {
      switch (data.winner) {
        case null:
          setIsWinner(null);
          break;

        case id:
          setIsWinner(true);
          break;

        default:
          setIsWinner(false);
          break;
      }
    });

    return () => {
      socket?.off("gameOver");
    };
  }, [id, socket]);

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

  const handlePlayAgain = () => {
    socket?.emit("joinRoom");
    setGameStarted(false);
    setIsWinner(undefined);
  };

  return (
    <GameView
      gameStarted={gameStarted}
      myHealth={myHealth}
      opponentHealth={opponentHealth}
      myDamageGotten={myDamageGotten}
      setMyDamageGotten={setMyDamageGotten}
      opponentDamageGotten={opponentDamageGotten}
      setOpponentDamageGotten={setOpponentDamageGotten}
      attackBodyPart={attackBodyPart}
      defendBodyPart={defendBodyPart}
      onChangeAttackBodyPart={handleChangeAttackBodyPart}
      onChangeDefendBodyPart={handleChangeDefendBodyPart}
      onAttack={handleAttack}
      isWaiting={isWaiting}
      isWinner={isWinner}
      onPlayAgain={handlePlayAgain}
      onQuit={handleQuit}
      maxHealth={MAX_HEALTH}
      logs={logs}
    />
  );
};
