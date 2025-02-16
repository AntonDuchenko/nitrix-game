import { IEntity } from "../types";

const rooms = new Map<string, Map<string, IEntity>>();

export const checkRoom = (roomName: string) => {
  return rooms.has(roomName);
};

export const getRoom = (roomName: string) => {
  return rooms.get(roomName);
};

export const splitRooms = () => {
  return rooms.entries();
};

export const setRoom = (roomName: string, room: Map<string, IEntity>) => {
  rooms.set(roomName, room);
};

export const removeRoom = (roomName: string) => {
  rooms.delete(roomName);
};
