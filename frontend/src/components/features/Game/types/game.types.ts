export enum BodyParts {
  HEAD = "head",
  NECK = "neck",
  CHEST = "chest",
  STOMACH = "stomach",
  LEGS = "legs",
}

export interface IEntity {
  entityId: string;
  updates: { health: number };
}

export interface IActions {
  attack: string | null;
  defend: string | null;
}

export interface ILog {
  playerId: string;
  actions: IActions;
  damage: number;
}

export interface IUpdateDto {
  entities: IEntity[];
  log: ILog[];
}
