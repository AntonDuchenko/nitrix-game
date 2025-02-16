import { IEntity, ILog } from "../types";

const rooms = new Map<
  string,
  {
    players: Map<string, IEntity>;
    log?: ILog[];
  }
>();

export const checkRoom = (roomName: string) => {
  return rooms.has(roomName);
};

export const getRoom = (roomName: string) => {
  return rooms.get(roomName)?.players;
};

export const splitRooms = () => {
  return rooms.entries();
};

export const setRoom = (
  roomName: string,
  room: {
    players: Map<string, IEntity>;
    log?: ILog[];
  }
) => {
  rooms.set(roomName, room);
};

export const removeRoom = (roomName: string) => {
  rooms.delete(roomName);
};

export const getLog = (roomName: string) => {
  return rooms.get(roomName)?.log;
};

export const addLog = (roomName: string, log: ILog) => {
  const room = rooms.get(roomName);
  if (room) {
    room.log?.push(log);
  }
};
