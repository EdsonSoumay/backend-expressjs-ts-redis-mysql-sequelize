import { io } from "../infrastructures/server";

const GeneralSocketEmitHelper = (event: string, data: Object) => {
    try {
        io.emit(`${event}`, data);
    } catch (error) {
        console.error(`Error emitting event ${event}:`, error);
        // Optional: handle error further or rethrow it
    }
}

const RoomSocketEmitHelper = (roomName: string, event: string, data: Object) => {
    try {
        io.to(`${roomName}`).emit(`${event}`, data);
    } catch (error) {
        console.error(`Error emitting event ${event} to room ${roomName}:`, error);
    }
}

export { GeneralSocketEmitHelper, RoomSocketEmitHelper };
