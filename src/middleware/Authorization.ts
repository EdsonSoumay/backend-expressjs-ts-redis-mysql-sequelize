import { Request, Response, NextFunction } from "express";
import jwt,  { JwtPayload }  from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction)=> {
    const secretKey: string = process.env.JWT_TOKEN as string;

    const token = req.cookies.token;
    // console.log("verify token:",token)
    if (!token) {
        return res.status(401).json("You are not authenticated!");
    }
    jwt.verify(token, secretKey, async (err: any, data: any) => {
        if (err) {
            return res.status(403).json("Token is not valid!");
        }
        req.userId = (data as JwtPayload)._id;
        next();
    });
};

export default {verifyToken}