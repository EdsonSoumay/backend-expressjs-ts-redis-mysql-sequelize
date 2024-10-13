import { Request, Response } from "express";
import User from "../db/models/User";
import Helper from "../helpers/Helper";
import PasswordHelper from "../helpers/PasswordHelper";
import { createSessionValidation, createUserValidation } from "../validations/auth.validation";

const register = async (req: Request, res: Response): Promise<Response> => {
	const { error, value } = createUserValidation(req.body)
	if(error){
		console.log("error validation:",error.details[0].message)
		return res.status(404).send({message: error.details[0].message })
	}	

	try {
		const { username, email, password, first_name, last_name } = value;

		const hashed = await PasswordHelper.PasswordHashing(password);
	
		const existUser = await User.findOne({ where:{ username }})
		if(existUser){
			return res.status(409).send({message: "duplicate user"});
		}
		
		await User.create({ username, email, first_name, last_name, password: hashed});
       	
		return res.status(201).send({
			message: 'Succesfully register user', 
		})
	} catch (error: any) {
        return res.status(500).send({message: error.message})
	}
};

const login = async (req: Request, res: Response): Promise<Response> => {
	const { error, value } = createSessionValidation(req.body)
	if(error){
		console.log("error validation:",error.details[0].message)
		return res.status(404).send({message: error.details[0].message })
	}

	try {
		const { username, password } = value;

		const user = await User.findOne({where: { username }});
        if(!user){
            return res.status(404).send({message: "User does not found!"})
        }

		const matched = await PasswordHelper.PasswordCompare(password, user.password);
		if (!matched) {
            return res.status(401).send({message: "Password does not match!"})
		}

		const dataUser = { id: user?.id, username: user?.username};
		
		const token = Helper.GenerateToken(dataUser);
		const refreshToken = Helper.GenerateRefreshToken(dataUser);
        return res
			.cookie("token",token, { httpOnly: true })
			.cookie("refreshToken", refreshToken, { httpOnly: true })
			.status(200)
			.send({ message: 'Succesfully login', data: user})
	} catch (error:any) {
		return res.status(500).send({message: error.message})
	}
};

// Function to handle logout
const logout = async (req: Request, res: Response): Promise<Response> => {
    try {
       return res
	   		 .clearCookie('token', { sameSite: 'none', secure: true })
        	 .clearCookie('refreshToken', { sameSite: 'none', secure: true })    
	  		 .status(200)
         	 .send({message: 'User logged out successfully!'});
    } catch (error: any) {
		return res.status(500).send({message: error.message})
    }
};

// Function to handle refetch user
const refetch = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		const decoded: any = Helper.ExtractRefreshToken(refreshToken)
		
		const user = await User.findOne({where:{id:decoded.id}})
		if(!user){
			return res.status(404).send({message: "User not found!"})
		}

		const dataUser = {id: user.id, username: user.username};
		const newToken = Helper.GenerateToken(dataUser);

		return res
		.cookie("token",newToken, { httpOnly: true })
		.status(200).send({message: "Succesfully refetch user", data:dataUser});
	} catch (error:any) {
		return res.status(500).send({message: error.message})
	}
}; 

export default { register, login, logout, refetch };