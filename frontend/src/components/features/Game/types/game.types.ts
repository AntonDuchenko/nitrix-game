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

