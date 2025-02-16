export interface IAttackDto {
  roomName: string;
  actions: IActions;
}

export interface IActions {
  attack: string | null;
  defend: string | null;
}
