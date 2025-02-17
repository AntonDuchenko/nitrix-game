import { ILog } from "../../types/game.types";
import styles from "./FightLogs.module.scss";
import { useShowLog } from "../../hooks/useShowLog";
import classNames from "classnames";

interface LogsProps {
  logs: ILog[];
}

export const FightLogs: React.FC<LogsProps> = ({ logs }) => {
  const { isShow, handleClick } = useShowLog();

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
              Player <span className={styles.player}>{log.player.email}</span> atacked{" "}
              <span className={styles.attack}>{log.actions.attack}</span> and
              defended{" "}
              <span className={styles.defend}>
                {log.actions.defend}
              </span> with{" "}
              <span
                className={classNames(styles.defend, {
                  [styles.attack]: log.damage > 0,
                })}
              >
                {log.damage}
              </span>{" "}
              damage.
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
