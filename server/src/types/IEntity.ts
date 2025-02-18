import { IActions } from './IAttackDto';

export interface IEntity {
  id: string;
  type: string;
  health: number;
  turn?: IActions | null;
}
