export interface IEntity {
  id: string;
  type: string;
  health: number;
  turn?: ITurn | null;
}

interface ITurn {
  attack: string;
  defend: string;
}
