import { Consumer } from "../participants";
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

    const room = village.rooms.find(
      (room) =>
        room.agent.socketId === socketId || room.consumer.socketId === socketId
    );

    if (room) {
      village.deleteRoom(room.roomId);

      console.log(
        `Room ${room.roomId} removed due to disconnection of ${socketId}`
      );
      userRemoved = true;
    }

    if (agent) {
      village.removeAgent(socketId);
      if (room) {
        village.joinConsumer(
          room.consumer.socketId,
          room.consumer.consumerName,
          room.consumer.email,
          room.consumer.message
        );
      }
      console.log(
        `Agent ${agent.agentName} removed from village ${village.villageId}`
      );
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

export async function verifyAccessKey(accessKey: string, villageId: string) {
  try {
    let isValid = false;
    const response = await fetch(`${process.env.BASE_SERVER_PATH}/village/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessKey: accessKey, villageId: villageId }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      isValid = data.valid;
    }

    return isValid;
  } catch (error) {
    console.log(error);
    return false;
  }
}

type SendEmailonConsumerJoinProps = {
  name:string,
  email:string,
  message:string,
  villageId:string
}
export async function sendEmailonConsumerJoin(payload:SendEmailonConsumerJoinProps){
  try {
    const response =  fetch(`${process.env.BASE_SERVER_PATH}/village/mails/consumer-waiting`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return false;
  }
} 