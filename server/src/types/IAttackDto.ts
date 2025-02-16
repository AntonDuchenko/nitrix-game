export interface IAttackDto {
  roomName: string;
  actions: {
    attack: string | null;
    defend: string | null;
  };
}
