import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { col } from "sequelize";

import User from "../db/models/User";
import Helper from "../helpers/Helper";
import PasswordHelper from "../helpers/PasswordHelper";

const register = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { username, email, password } = req.body;
		const hashed = await PasswordHelper.PasswordHashing(password);
		const existUser = await User.findOne({ where:{ username }})
		if(existUser){
			return res.status(409).send({message: "duplicate user"});
		}
		const user = await User.create({ username, email,password: hashed});
       return res.status(201).json(user)
	} catch (error: any) {
        return res.status(500).json(error)
	}
};

const login = async (req: Request, res: Response): Promise<Response> => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({
			where: { email },
			attributes: {
			  include: [[col('id'), '_id']]
			}
		  });

        if(!user){
            return res.status(404).json("User not found!")
        }
		
		const matched = await PasswordHelper.PasswordCompare(password, user.password);
		if (!matched) {
            return res.status(401).json("Wrong credentials!")
		}

		const dataUser = {
			id: user.id,
			_id: user.id,
			username: user.username,
			email: user.email,
		};
		const token = Helper.GenerateToken(dataUser);
        return res.cookie("token",token).status(200).json(user)

	} catch (err) {
		return res.status(500).json(err)
	}
};

// Function to handle logout
const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
       return res.clearCookie('token', { sameSite: 'none', secure: true })
            .status(200)
            .send('User logged out successfully!');
    } catch (err) {
       return res.status(500).json(err);
    }
};

// Function to handle refetch user
const refetch = (req: Request, res: Response) => {
	try {
		const token = req.cookies.token;
		const secretKey: string = process.env.JWT_TOKEN as string;

		jwt.verify(token, secretKey, {}, async (err, data) => {
			if (err) {
				return res.status(404).json(err);
			}
			return res.status(200).json(data);
		});
	} catch (error) {
		return res.status(500).json(error);
	}
}; 

export default { register, login, logout, refetch };