import express, {  Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { routes } from "../routes/routes";
import RedisSetUp from "./RedisSetUp";

const createServer =  () =>{
    dotenv.config();
    const app = express();
    app.locals.redisClient = RedisSetUp();
    app.use(morgan('dev')); // Add this line to use morgan
    app.use(express.json());

    app.use("/images",express.static('./public/images'))
    
    app.use(cors({
        credentials: true,
        origin: true
        // origin: "http://localhost:5173"
    }));
    app.use(cookieParser());
    
    app.get("/", (req: Request, res: Response) => {
        return res.status(200).send({
            response: "Express TypeScript"
        });
    });
    routes(app)

    return app;
}
export default createServer;