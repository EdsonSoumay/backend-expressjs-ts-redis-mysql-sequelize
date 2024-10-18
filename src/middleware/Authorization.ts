import { Request, Response, NextFunction } from "express";
import jwt,  { JwtPayload }  from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserService } from "../services/user.service";
dotenv.config();

interface AuthenticatedRequest extends Request {
    user_id?: string;
}

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction)=> {
    const secretKey: string = process.env.JWT_TOKEN as string;

    const token = req.cookies.token;
    // console.log("verify token:",token)
    if (!token) {
        return res.status(401).send({message: "You are not authenticated!"});
    }
    jwt.verify(token, secretKey, async (err: any, data: any) => {
        if (err) {
            return res.status(403).json({message: "Token is not valid!"});
        }

        if(data){
            const findUser = await getUserService(data.id)
            if(!findUser){
              return res
              .clearCookie('token', { sameSite: 'none', secure: true })
              .clearCookie('refreshToken', { sameSite: 'none', secure: true })    
              .status(402)
              .send({message: 'User does not exist in authorization'});
            }
        }

        req.user_id = (data as JwtPayload).id;
        next();
    });
};

export default {verifyToken}