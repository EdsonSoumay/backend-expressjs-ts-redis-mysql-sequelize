import { Request, Response } from "express";
import { deleteUserService, getUserService, updateUserService } from "../services/user.service";
import { createUserValidation } from "../validations/auth.validation";

const getUser = async (req: Request, res: Response): Promise<Response> => {
	const { id } = req.params;
	try{
		const result =  await getUserService(id)
		if(!result){
			return res.status(404).send({message: 'user does not found'})
		}
		
		return res.status(200).send({message: 'successfuly get user', data: result})
    }
    catch(error:any){
       return res.status(500).send({message: error.message})
    }
};

const updateUser = async (req: Request, res: Response): Promise<Response> => {
	const { id } = req.params;
	const { error, value } = createUserValidation(req.body)

	if(error){
		console.log("error validation:",error.details[0].message)
		return res.status(404).send({message: error.details[0].message })
	}

	try{
		const result = updateUserService(id, value)
		if(!result){
			return res.status(404).send({message: 'user does not found'})
		}

		return res.status(200).send({message: 'successfuly update user', data: result})
    }
    catch(error:any){
       return res.status(500).send({message: error.message})
    }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
	const { id } = req.params;
	try{
		const result = await deleteUserService(id)
		if(!result){
			return res.status(404).send({message: 'user does not found'})
		}

		return res.status(200).send({message: 'successfuly update user', data: result})
    }
    catch(error:any){
       return res.status(500).send({message: error.message})
    }
};

export default {getUser, updateUser, deleteUser};