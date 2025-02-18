import { Server } from "socket.io";
import { IAttackDto, IAuthSocket, IEntity } from "../types";
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

const disconnectedPlayers = new Map<
  string,
  { room: string; entity: IEntity }
>();
let roomName = `room-${Date.now()}`;

export function handleJoinRoom(socket: IAuthSocket, io: Server) {
  socket.join(roomName);
  socket.emit("joinedRoom", { roomName });

  const clientsInRoom = io.sockets.adapter.rooms.get(roomName)?.size || 0;
  const playerId = socket.user?.id;
  if (!playerId) return;

  const defaultEntity: IEntity = {
    id: playerId,
    type: "player",
    health: constants.MAX_HEALTH,
  };

  if (!checkRoom(roomName)) {
    setRoom(roomName, { players: new Map<string, IEntity>(), log: [] });
  }

  const roomEntities = getRoom(roomName);
  roomEntities?.set(playerId, defaultEntity);

  if (clientsInRoom === constants.MAX_PLAYERS && roomEntities) {
    io.sockets.in(roomName).emit("startGame", {
      roomName,
      players: Array.from(roomEntities.values()),
      turn: null,
    });

    roomName = `room-${Date.now()}`;
  }
}

export function handleReconnectRoom(socket: IAuthSocket, io: Server) {
  const playerId = socket.user?.id;
  if (!playerId) return;

  const playerData = disconnectedPlayers.get(playerId);
  if (!playerData) {
    socket.emit("reconnectError");
    return;
  }

  const { room, entity } = playerData;
  if (checkRoom(room)) {
    socket.join(room);
    entity.id = playerId;
    const roomEntities = getRoom(room);

    if (!roomEntities) return;

    roomEntities?.set(playerId, entity);
    disconnectedPlayers.delete(playerId);

    io.to(socket.id).emit("startGame", {
      roomName: room,
      players: Array.from(roomEntities.values()).map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ turn, ...rest }) => rest
      ),
      turn: playerData.entity.turn,
    });

    console.log(`Player ${playerId} reconnected to room ${room}`);
  } else {
    socket.emit("reconnectError", {
      message: "Room not found"});
  }
}

export async function handleAttack(
  socket: IAuthSocket,
  io: Server,
  data: IAttackDto
) {
  const playerId = socket.user?.id;
  if (!playerId) return;

  const currentRoom = getRoom(data.roomName);
  if (!currentRoom) return;

  const targetEntity = currentRoom.get(playerId);
  if (!targetEntity || !data.actions.attack || targetEntity.turn) return;

  targetEntity.turn = data.actions;

  const opponent = Array.from(currentRoom.values()).find(
    (entity) => entity.id !== playerId
  );
  if (!opponent) return;

  if (opponent.turn && targetEntity.turn) {
    const targetData = await getUserById(targetEntity.id);
    const opponentData = await getUserById(opponent.id);
    if (!targetData) return;
    if (!opponentData) return;

    if (opponent.turn.attack !== targetEntity.turn.defend) {
      targetEntity.health -= constants.DAMAGE;

      addLog(data.roomName, {
        player: {
          playerId: targetData.id,
          email: targetData?.email,
        },
        actions: targetEntity.turn,
        damage: constants.DAMAGE,
      });
    }

    if (opponent.turn.attack === targetEntity.turn.defend) {
      addLog(data.roomName, {
        player: {
          playerId: targetData.id,
          email: targetData?.email,
        },
        actions: targetEntity.turn,
        damage: 0,
      });
    }

    if (targetEntity.turn.attack !== opponent.turn.defend) {
      opponent.health -= constants.DAMAGE;

      addLog(data.roomName, {
        player: {
          playerId: opponentData.id,
          email: opponentData.email,
        },
        actions: opponent.turn,
        damage: constants.DAMAGE,
      });
    }

    if (targetEntity.turn.attack === opponent.turn.defend) {
      addLog(data.roomName, {
        player: {
          playerId: opponentData.id,
          email: opponentData.email,
        },
        actions: opponent.turn,
        damage: 0,
      });
    }

    if (targetEntity.health <= 0 && opponent.health <= 0) {
      io.to(data.roomName).emit("gameOver", { winner: null });
      removeRoom(data.roomName);
    } else if (targetEntity.health <= 0 || opponent.health <= 0) {
      io.to(data.roomName).emit("gameOver", {
        winner: targetEntity.health <= 0 ? opponent.id : targetEntity.id,
      });
      removeRoom(data.roomName);
    }

    targetEntity.turn = null;
    opponent.turn = null;

    io.to(data.roomName).emit("entityUpdated", {
      entities: [
        { entityId: targetEntity.id, updates: { health: targetEntity.health } },
        { entityId: opponent.id, updates: { health: opponent.health } },
      ],
      log: getLog(data.roomName),
    });
  }
}

export function handleDisconnect(socket: IAuthSocket, io: Server) {
  const playerId = socket.user?.id;
  if (!playerId) return;

  for (const [room, entities] of splitRooms()) {
    if (entities.players.has(playerId)) {
      const playerEntity = entities.players.get(playerId);

      if (playerEntity) {
        disconnectedPlayers.set(playerId, { room, entity: playerEntity });
      }

      entities.players.delete(playerId);
      if (entities.players.size === 0) {
        removeRoom(room);
      } else {
        io.to(room).emit("playerDisconnected", { playerId });
      }
      break;
    }
  }

  console.log(`User ${playerId} disconnected.`);
}
