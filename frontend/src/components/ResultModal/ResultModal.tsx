import { createPortal } from "react-dom";
import styles from "./ResultModal.module.scss";
import { Button } from "../Button/Button";
import classNames from "classnames";

interface ResultModalProps {
  onQuit: () => void;
  onPlayAgain: () => void;
  isWinner: boolean | null;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isWinner,
  onPlayAgain,
  onQuit,
}) => {
  return createPortal(
    <div className={styles.modalWrapper}>
      <div
        className={classNames(styles.modal, {
          [styles.winner]: isWinner,
        })}
      >
        Result
        <span>{isWinner ? "You win" : "You lose"}</span>
        <div className={styles.buttons}>
          <Button onClick={onQuit}>Quit</Button>
          <Button onClick={onPlayAgain}>Play again</Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
