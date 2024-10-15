// server.ts
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";
import { routes } from "../routes/routes";
import redis from "../infrastructures/redis";
import Authorization from "../middleware/Authorization";

let io: Server; // Declare a variable for io

const createServer = () => {
    dotenv.config();
    const app = express();
    app.locals.redisClient = redis();
    app.use(morgan('dev'));
    app.use(express.json());

    // CORS configuration
    const corsOptions = {
        credentials: true,
        origin: "http://localhost:5173", // Change to your frontend URL
    };

    app.use(cors(corsOptions)); // Use CORS middleware for Express

    app.use(cookieParser());
    app.use("/images", Authorization.verifyToken, express.static('./public/images'));
    app.get("/", (req: Request, res: Response) => {
        return res.status(200).send({
            response: "Express TypeScript"
        });
    });

    // Initialize routes
    routes(app);

    // Create HTTP server and initialize socket.io
    const httpServer = require('http').createServer(app);
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173", // Same as above
            methods: ["GET", "POST"],
            credentials: true, // Allow credentials
        },
    }); // Initialize io with CORS settings

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

    return { app, httpServer, io }; // Return app, httpServer, and io
}

export { createServer }; // Export only createServer
export { io }; // Export io separately
