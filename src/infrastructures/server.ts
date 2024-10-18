// server.ts
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { routes } from "../routes/routes";
import Authorization from "../middleware/Authorization";
import { createSocketServer } from "./socket"; // Import createSocketServer
import CreateRedis from "./redis";

let io: any; // Declare io globally

const createServer = () => {
    dotenv.config();
    const app = express();
    app.locals.redisClient = CreateRedis();
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

    // Create HTTP server
    const httpServer = require('http').createServer(app);

    // Initialize Socket.IO using socket.ts
    io = createSocketServer(httpServer);

    return { app, httpServer, io }; // Return app, httpServer, and io
}

export { createServer, io }; // Export both createServer and io
