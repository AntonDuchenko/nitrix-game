import { useEffect, useState } from "react";
import { useSocket } from "../../../../hooks/useSocket";
import { GameView } from "../views/GameView";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { BodyParts, IEntity, ILog } from "../types/game.types";

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
    if (!socket) return;

    const handleStartGame = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "startGame") {
        if (data.payload.turn) {
          setAttackBodyPart(data.payload.turn.attack as BodyParts);
          setDefendBodyPart(data.payload.turn.defend as BodyParts);
          setIsWaiting(true);
        }
        setMyHealth(
          data.payload.players.find(
            (player: { id: string; type: string; health: number }) =>
              player.id === id
          ).health
        );

        setOpponentHealth(
          data.payload.players.find(
            (player: { id: string; type: string; health: number }) =>
              player.id !== id
          ).health
        );

        setGameStarted(true);
      }
    };

    socket.addEventListener("message", handleStartGame);

    return () => {
      socket?.removeEventListener("message", handleStartGame);
    };
  }, [socket, id]);

  useEffect(() => {
    if (!socket) return;

    const handleEntityUpdated = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "entityUpdated") {
        data.payload.entities.forEach((entity: IEntity) => {
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
      }
    };

    socket.addEventListener("message", handleEntityUpdated);

    return () => {
      socket?.removeEventListener("message", handleEntityUpdated);
    };
  }, [socket, id, myHealth, opponentHealth]);

  useEffect(() => {
    if (!socket) return;

    const handlerReconnectErorr = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "reconnectError") {
        Cookies.remove("roomName");
        navigate("/game", { replace: true });
        socket.close();
      }
    };

    socket.addEventListener("message", handlerReconnectErorr);

    return () => {
      socket?.removeEventListener("message", handlerReconnectErorr);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handlerGameOver = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "gameOver") {
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
      }
    };

    socket.addEventListener("message", handlerGameOver);

    return () => {
      socket?.removeEventListener("message", handlerGameOver);
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
    socket?.close();
    Cookies.remove("roomName");
    navigate("/game", { replace: true });
  };

  const handleAttack = () => {
    socket?.send(
      JSON.stringify({
        type: "attack",
        payload: {
          roomName: Cookies.get("roomName"),
          actions: {
            attack: attackBodyPart,
            defend: defendBodyPart,
          },
        },
      })
    );

    setIsWaiting(true);
  };

  const handlePlayAgain = () => {
    socket?.send(JSON.stringify({ type: "joinRoom" }));
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
