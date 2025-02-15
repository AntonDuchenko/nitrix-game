import styles from "./Player.module.scss";
import { ImageEnum } from "../../ImageEnum";
import { BodyParts } from "../../types";
import classNames from "classnames";
import { useEffect, useState } from "react";

const bodyParts = Object.values(BodyParts);
const MAX_HEALTH = 10;

interface PlayerProps {
  health: number;
  type: string;
  damage: number | null;
  setDamage: React.Dispatch<React.SetStateAction<number | null>>;
  onChangeBodyPart: (event: React.ChangeEvent<HTMLInputElement>) => void;
  bodyPart: BodyParts | null;
}

export const Player: React.FC<PlayerProps> = ({
  health,
  type,
  damage,
  setDamage,
  onChangeBodyPart,
  bodyPart,
}) => {
  const isMe = type === "defender";
  const [coordinate, setCoordinate] = useState(0);

  useEffect(() => {
    if (damage !== null) {
      setCoordinate(Math.floor(Math.random() * 80) + 10);

      const timeOut = setTimeout(() => {
        setDamage(null);
        clearTimeout(timeOut);
      }, 1000);

      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [damage]);

  return (
    <div
      className={classNames(styles.playersContainter, {
        [styles.defenderContainer]: isMe,
      })}
    >
      <div className={styles.healthContainer}>
        <progress className={styles.healthBar} value={health} max="10" />
        <span className={styles.healthValue}>
          {health}/{MAX_HEALTH}
        </span>
        {damage !== null && (
          <span
            style={{
              left: `${coordinate}%`,
              transform: `translateX(-${coordinate}%)`,
            }}
            className={classNames(styles.damage, {
              [styles.damageMe]: damage > 0,
              [styles.blocked]: damage === 0,
            })}
          >
            <img src={damage > 0 ? ImageEnum.Sword : ImageEnum.Shield} />
            {damage}
          </span>
        )}
      </div>
      <div
        className={classNames(styles.player, {
          [styles.defender]: isMe,
        })}
      >
        <ul className={styles.bodyList}>
          {bodyParts.map((part) => (
            <li className={styles.bodyItem} key={part}>
              <input
                className={classNames(styles.inputRadio, {
                  [styles.defence]: isMe,
                })}
                type="radio"
                name={type}
                onChange={onChangeBodyPart}
                id={`${type}-${part}`}
                value={part}
                checked={bodyPart === part}
              />
              <label htmlFor={`${type}-${part}`}>
                <img src={isMe ? ImageEnum.Shield : ImageEnum.Sword} />
                {part}
              </label>
            </li>
          ))}
        </ul>
        <img
          src={ImageEnum.Warrior}
          alt="Warrior image"
          className={styles.image}
        />
      </div>
    </div>
  );
};
