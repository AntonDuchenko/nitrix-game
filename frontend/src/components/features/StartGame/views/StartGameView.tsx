import { Button } from "../../../common";
import styles from "./StartGameView.module.scss";

interface StartGameViewProps {
  handleClick: () => void;
}

export const StartGameView: React.FC<StartGameViewProps> = ({
  handleClick,
}) => {
  return (
    <div className={styles.game}>
      <Button onClick={handleClick} className={styles.playBtn}>
        Play
      </Button>
    </div>
  );
};
