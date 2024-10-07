import { Request, Response } from "express";
import { deleteUserService, getUserService, updateUserService } from "../services/user.service";
import { createUserValidation } from "../validations/auth.validation";

const getUser = async (req: Request, res: Response): Promise<Response> => {
	try{
		const { id } = req.params;
		const result =  await getUserService(id)
    	return res.status(200).json(result)
    }
    catch(err){
        return res.status(500).json(err)
    }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
	try{
		const { error, value } = createUserValidation(req.body)
		if(error){
			console.log("error validation:",error.details[0].message)
			return res.status(404).send({message: error.details[0].message })
		}
		
		const { id } = req.params;
		const result = updateUserService(id, value)
       	return res.status(200).json(result)
    }
    catch(err){
        return res.status(500).json(err)
    }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
	try{
		const { id } = req.params;
		const result = await deleteUserService(id)
   	    return res.status(200).json(result)
    }
    catch(err){
        return res.status(500).json(err)
    }
};

export default {getUser, updateUser, deleteUser};