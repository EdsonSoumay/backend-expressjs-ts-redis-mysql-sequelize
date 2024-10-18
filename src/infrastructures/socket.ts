// socket.ts
import { Server } from "socket.io";

const createSocketServer = (httpServer: any) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.URL_FRONT_END, // URL frontend Anda
            methods: ["GET", "POST"],
            credentials: true, // Izinkan kredensial
        },
    });

    // Socket.io connection handling
    io.on("connection", (socket: any) => {
        console.log(`New client connected: ${socket.id}`);

        // Handle client joining a room
        socket.on("joinRoom", (room: string) => {
            socket.join(room); // Join the specified room
            console.log(`Client ${socket.id} joined room: ${room}`);
            socket.to(room).emit("notification", `${socket.id} has joined the room.`);
        });

        // Handle message event within a room
        socket.on("message", (data: { room: string, message: string }) => {
            console.log(`Message received in room ${data.room}: ${data.message}`);
            io.to(data.room).emit("response", { message: data.message });
        });

        // Handle client leaving the room
        socket.on("leaveRoom", (room: string) => {
            socket.leave(room); // Leave the specified room
            console.log(`Client ${socket.id} left room: ${room}`);
            socket.to(room).emit("notification", `${socket.id} has left the room.`);
        });

        // Handle client disconnect
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io; // Return the Socket.IO instance
};

export { createSocketServer };
