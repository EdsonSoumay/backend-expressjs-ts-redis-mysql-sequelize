import { io } from "../infrastructures/server"

const SocketEmitHelper = (title: string, data: Object) => {
    return io.emit(`${title}`, data);
}

export {SocketEmitHelper}