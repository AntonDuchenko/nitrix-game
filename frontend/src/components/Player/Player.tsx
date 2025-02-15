import styles from "./Player.module.scss";
import { ImageEnum } from "../../ImageEnum";
import { BodyParts } from "../../types";

const bodyParts = Object.values(BodyParts);

interface PlayerProps {
  health: number;
  name: string;
  onChangeBodyPart: (event: React.ChangeEvent<HTMLInputElement>) => void;
  bodyPart: BodyParts | null;
}

export const Player: React.FC<PlayerProps> = ({
  health,
  name,
  onChangeBodyPart,
  bodyPart,
}) => {
  return (
    <div className={styles.playersContainter}>
      <progress className={styles.healthBar} value={health} max="10" />
      <div className={styles.player}>
        <ul className={styles.bodyList}>
          {bodyParts.map((part) => (
            <li className={styles.bodyItem} key={part}>
              <input
                type="radio"
                name={name}
                onChange={onChangeBodyPart}
                id={`${name}-${part}`}
                value={part}
                checked={bodyPart === part}
              />
              <label htmlFor={`${name}-${part}`} className={styles.name}>
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
