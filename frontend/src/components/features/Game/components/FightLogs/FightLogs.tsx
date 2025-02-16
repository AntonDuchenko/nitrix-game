import { useState } from "react";
import { ILog } from "../../types/game.types";
import styles from "./FightLogs.module.scss";

interface LogsProps {
  logs: ILog[];
}

export const FightLogs: React.FC<LogsProps> = ({ logs }) => {
  const [isShow, setIsShow] = useState(false);

  const handleClick = () => {
    setIsShow((current) => !current);
  };

  return (
    <div className={styles.logBtn} onClick={handleClick}>
      <div className={styles.text}>
        <span>{isShow ? "Close" : "Open"}</span>
        <span>logs</span>
      </div>

      {isShow && logs && logs.length > 0 && (
        <div className={styles.logsList}>
          {logs.map((log, index) => (
            <div key={index} className={styles.log}>
              Player {log.playerId} atacked {log.actions.attack} and defended{" "}
              {log.actions.defend} with {log.damage} damage
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
