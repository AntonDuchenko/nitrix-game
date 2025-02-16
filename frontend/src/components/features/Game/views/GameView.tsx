import { Button, Loader } from "../../../common";
import { Logs } from "../components/Logs/Logs";
import { Player } from "../components/Player/Player";
import { ResultModal } from "../components/ResultModal/ResultModal";
import { BodyParts, ILog } from "../types/game.types";
import styles from "./GameView.module.scss";

interface GameViewProps {
  gameStarted: boolean;
  myHealth: number;
  opponentHealth: number;
  myDamageGotten: number | null;
  setMyDamageGotten: React.Dispatch<React.SetStateAction<number | null>>;
  opponentDamageGotten: number | null;
  setOpponentDamageGotten: React.Dispatch<React.SetStateAction<number | null>>;
  attackBodyPart: BodyParts | null;
  defendBodyPart: BodyParts | null;
  onChangeAttackBodyPart: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDefendBodyPart: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAttack: () => void;
  isWaiting: boolean;
  isWinner: boolean | null | undefined;
  onPlayAgain: () => void;
  onQuit: () => void;
  maxHealth: number;
  logs: ILog[];
}

export const GameView: React.FC<GameViewProps> = ({
  gameStarted,
  myHealth,
  opponentHealth,
  myDamageGotten,
  setMyDamageGotten,
  opponentDamageGotten,
  setOpponentDamageGotten,
  attackBodyPart,
  defendBodyPart,
  onChangeAttackBodyPart,
  onChangeDefendBodyPart,
  onAttack,
  isWaiting,
  isWinner,
  onPlayAgain,
  onQuit,
  maxHealth,
  logs
}) => {
  return (
    <div className={styles.game}>
      {!gameStarted ? (
        <div className={styles.position}>
          You are alone in the queue. Please wait your opponent.
          <Loader />
          <Button className={styles.quitBtn} onClick={onQuit}>
            Quit
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.players}>
            <Player
              health={myHealth}
              damage={myDamageGotten}
              setDamage={setMyDamageGotten}
              type="defender"
              onChangeBodyPart={onChangeDefendBodyPart}
              bodyPart={defendBodyPart}
              maxHealth={maxHealth}
            />

            <Logs logs={logs} />

            <Player
              health={opponentHealth}
              damage={opponentDamageGotten}
              setDamage={setOpponentDamageGotten}
              type="attacker"
              onChangeBodyPart={onChangeAttackBodyPart}
              bodyPart={attackBodyPart}
              maxHealth={maxHealth}
            />
          </div>

          <Button
            onClick={onAttack}
            disabled={!attackBodyPart || !defendBodyPart || isWaiting}
            className={styles.attackBtn}
          >
            {isWaiting ? "Waiting for your opponent" : "Attack"}
          </Button>
        </>
      )}

      {isWinner !== undefined && (
        <ResultModal
          onQuit={onQuit}
          onPlayAgain={onPlayAgain}
          isWinner={isWinner}
        />
      )}
    </div>
  );
};
