import { io } from "../infrastructures/server"

const GeneralSocketEmitHelper = (event: string, data: Object) => {
    return io.emit(`${event}`, data);
}

const RoomSocketEmitHelper = (roomName: string, event: string, data: Object) => {
    return io.to(`${roomName}`).emit(`${event}`, data);
}

export {GeneralSocketEmitHelper, RoomSocketEmitHelper}