import WebSocket from "ws";
import { IAttackDto, IEntity } from "../types";
import {
  addLog,
  checkRoom,
  getLog,
  getRoom,
  removeRoom,
  setRoom,
  splitRooms,
} from "../services/socket.service";
import constants from "../constants";
import { getUserById } from "../services/auth.service";

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  roomName?: string;
}

interface Message {
  type: string;
  payload: unknown;
}

const disconnectedPlayers = new Map<
  string,
  { room: string; entity: IEntity }
>();
let roomName = `room-${Date.now()}`;

function broadcastToRoom(
  wss: WebSocket.Server,
  room: string,
  message: Message,
  sender?: WebSocket
) {
  wss.clients.forEach((client: ExtendedWebSocket) => {
    if (
      client.roomName === room &&
      client !== sender &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(JSON.stringify(message));
    }
  });
}

export function handleJoinRoom(
  socket: ExtendedWebSocket,
  wss: WebSocket.Server
) {
  // console.log("handleJoinRoom", socket.userId, socket);

  if (!socket.userId) return;

  socket.roomName = roomName;
  socket.send(
    JSON.stringify({
      type: "joinedRoom",
      payload: { roomName },
    })
  );

  const clientsInRoom = Array.from(wss.clients).filter(
    (client: ExtendedWebSocket) => client.roomName === roomName
  ).length;

  const defaultEntity: IEntity = {
    id: socket.userId,
    type: "player",
    health: constants.MAX_HEALTH,
  };

  if (!checkRoom(roomName)) {
    setRoom(roomName, { players: new Map<string, IEntity>(), log: [] });
  }

  const roomEntities = getRoom(roomName);
  if (roomEntities) {
    roomEntities.set(socket.userId, defaultEntity);
  }

  if (clientsInRoom === constants.MAX_PLAYERS && roomEntities) {
    const gameStartMessage = {
      type: "startGame",
      payload: {
        roomName,
        players: Array.from(roomEntities.values()),
        turn: null,
      },
    };

    broadcastToRoom(wss, roomName, gameStartMessage);
    socket.send(JSON.stringify(gameStartMessage));

    roomName = `room-${Date.now()}`;
  }
}

export function handleReconnectRoom(socket: ExtendedWebSocket) {
  if (!socket.userId) return;

  const playerData = disconnectedPlayers.get(socket.userId);
  if (!playerData) {
    socket.send(JSON.stringify({ type: "reconnectError" }));
    return;
  }

  const { room, entity } = playerData;
  if (checkRoom(room)) {
    socket.roomName = room;
    entity.id = socket.userId;
    const roomEntities = getRoom(room);

    if (!roomEntities) return;

    roomEntities.set(socket.userId, entity);
    disconnectedPlayers.delete(socket.userId);

    socket.send(
      JSON.stringify({
        type: "startGame",
        payload: {
          roomName: room,
          players: Array.from(roomEntities.values()).map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ turn, ...rest }) => rest
          ),
          turn: playerData.entity.turn,
        },
      })
    );

    console.log(`Player ${socket.userId} reconnected to room ${room}`);
  }
}

export async function handleAttack(
  socket: ExtendedWebSocket,
  wss: WebSocket.Server,
  data: IAttackDto
) {
  if (!socket.userId || !socket.roomName) return;

  const currentRoom = getRoom(data.roomName);
  if (!currentRoom) return;

  const targetEntity = currentRoom.get(socket.userId);
  if (!targetEntity || !data.actions.attack || targetEntity.turn) return;

  targetEntity.turn = data.actions;

  const opponent = Array.from(currentRoom.values()).find(
    (entity) => entity.id !== socket.userId
  );
  if (!opponent) return;

  if (opponent.turn && targetEntity.turn) {
    const targetData = await getUserById(targetEntity.id);
    const opponentData = await getUserById(opponent.id);
    if (!targetData || !opponentData) return;

    // Combat logic
    if (opponent.turn?.attack !== targetEntity.turn?.defend) {
      targetEntity.health -= constants.DAMAGE;
      addLog(roomName, {
        player: {
          playerId: targetData.id,
          email: targetData.email,
        },
        actions: targetEntity.turn,
        damage: constants.DAMAGE,
      });
    } else {
      addLog(roomName, {
        player: {
          playerId: targetData.id,
          email: targetData.email,
        },
        actions: targetEntity.turn,
        damage: 0,
      });
    }

    if (targetEntity.turn?.attack !== opponent.turn?.defend) {
      opponent.health -= constants.DAMAGE;
      addLog(roomName, {
        player: {
          playerId: opponentData.id,
          email: opponentData.email,
        },
        actions: opponent.turn,
        damage: constants.DAMAGE,
      });
    } else {
      addLog(roomName, {
        player: {
          playerId: opponentData.id,
          email: opponentData.email,
        },
        actions: opponent.turn,
        damage: 0,
      });
    }

    // Handle game over conditions
    if (targetEntity.health <= 0 && opponent.health <= 0) {
      broadcastToRoom(wss, data.roomName, {
        type: "gameOver",
        payload: { winner: null },
      });
      removeRoom(data.roomName);
    } else if (targetEntity.health <= 0 || opponent.health <= 0) {
      broadcastToRoom(wss, data.roomName, {
        type: "gameOver",
        payload: {
          winner: targetEntity.health <= 0 ? opponent.id : targetEntity.id,
        },
      });
      removeRoom(data.roomName);
    }

    targetEntity.turn = null;
    opponent.turn = null;

    // Update all clients with new entity states
    const updateMessage = {
      type: "entityUpdated",
      payload: {
        entities: [
          {
            entityId: targetEntity.id,
            updates: { health: targetEntity.health },
          },
          { entityId: opponent.id, updates: { health: opponent.health } },
        ],
        log: getLog(data.roomName),
      },
    };

    broadcastToRoom(wss, data.roomName, updateMessage);
    socket.send(JSON.stringify(updateMessage));
  }
}

export function handleDisconnect(
  socket: ExtendedWebSocket,
  wss: WebSocket.Server
) {
  if (!socket.userId) return;

  for (const [room, entities] of splitRooms()) {
    if (entities.players.has(socket.userId)) {
      const playerEntity = entities.players.get(socket.userId);

      if (playerEntity) {
        disconnectedPlayers.set(socket.userId, { room, entity: playerEntity });
      }

      entities.players.delete(socket.userId);
      if (entities.players.size === 0) {
        removeRoom(room);
      } else {
        broadcastToRoom(wss, room, {
          type: "playerDisconnected",
          payload: { playerId: socket.userId },
        });
      }
      break;
    }
  }

  console.log(`User ${socket.userId} disconnected.`);
}
