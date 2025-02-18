import { createContext } from "react";

export interface ISocketContext {
  socket: WebSocket | null;
  connect: (url: string) => void;
  isConnected: boolean;
}

export const SocketContext = createContext<ISocketContext | null>(null);
