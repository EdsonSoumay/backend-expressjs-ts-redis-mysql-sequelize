import { Server } from "socket.io";

const createSocketServer = (httpServer: any) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173", // URL frontend Anda
            methods: ["GET", "POST"],
            credentials: true, // Izinkan kredensial
        },
    });

    // Socket.io connection handling
    io.on("connection", (socket: any) => {
        console.log(`New client connected: ${socket.id}`);

        socket.on("message", (data: any) => {
            console.log("Message received:", data);
            socket.emit("response", { message: "Message received" });
        });

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io; // Kembalikan instance Socket.IO
};

export { createSocketServer };
