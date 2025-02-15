import { createContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export interface ISocketContext {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  connect: (url: string) => void;
  isConnected: boolean;
}

export const SocketContext = createContext<ISocketContext | null>(null);

