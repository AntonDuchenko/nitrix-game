import { IActions } from "./IAttackDto";

export interface ILog {
  player: PlayerData;
  actions: IActions;
  damage: number;
}

export interface PlayerData {
  playerId: string;
  email: string;
}
