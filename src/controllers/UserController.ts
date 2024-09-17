import { Request, Response } from "express";
import { col } from "sequelize";
import User from "../db/models/User";

const getUser = async (req: Request, res: Response): Promise<Response> => {
	try{
		const { id } = req.params;
		const existUser = await User.findOne({
			where: { id },
			attributes: {
			  include: [[col('id'), '_id']]
			}
		  });
		
    	return res.status(200).json(existUser)
    }
    catch(err){
        return res.status(500).json(err)
    }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
	try{
		const { id } = req.params;
		const { username, email, password } = req.body;
		const user = await User.update({
			username, email
		  }, { where: { id } });

       return res.status(200).json(user)
    }
    catch(err){
        return res.status(500).json(err)
    }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
	try{
		const { id } = req.params;
		const user = await User.destroy({ where: { id } });
   	    return res.status(200).json(user)
    }
    catch(err){
        return res.status(500).json(err)
    }
};

export default {getUser, updateUser, deleteUser};