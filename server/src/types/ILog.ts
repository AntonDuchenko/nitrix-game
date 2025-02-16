import { IActions } from "./IAttackDto";

export interface ILog {
  playerId: string;
  actions: IActions;
  damage: number;
}
