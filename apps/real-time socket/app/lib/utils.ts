import { villages } from "../village";

export function handleDisconnection(socketId: string) {
  let userRemoved = false;

  for (const village of villages) {
    const consumer = village.getWaitlistUserById(socketId);
    const agent = village.getAgentById(socketId);

    if (consumer) {
      village.removeConsumerFromWaitlist(socketId);
      console.log(
        `Consumer ${consumer.consumerName} removed from village ${village.villageId}`
      );
      village.updateWaitlist();
      userRemoved = true;
    }

    if (agent) {
      village.removeAgent(socketId);
      console.log(
        `Agent ${agent.agentName} removed from village ${village.villageId}`
      );
      userRemoved = true;
    }

    const room = village.rooms.find(
      (room) =>
        room.agent.socketId === socketId || room.consumer.socketId === socketId
    );
    if (room) {
      village.deleteRoom(room.roomId);
      console.log(`Room ${room.roomId} removed due to disconnection`);
      userRemoved = true;
    }
  }

  if (!userRemoved) {
    console.log(`Disconnected socket ${socketId} was not found in any village`);
  }
}

export function removeEntityFromArray(
  array: any[],
  socketId: string,
  entityType: string
) {
  const index = array.findIndex((entity) => entity.socketId === socketId);
  if (index !== -1) {
    const removedEntity = array.splice(index, 1)[0];
    console.log(`${entityType} ${removedEntity.socketId} removed`);
  }
}
