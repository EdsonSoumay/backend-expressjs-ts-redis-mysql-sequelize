import { Request, Response } from "express";
import { Op, col } from "sequelize";
import Comment from "../db/models/comment";

const createComment = async (req: Request, res: Response): Promise<Response> =>{
    try {
      const newComment = await Comment.create(req.body);
      return res.status(200).json(newComment)
    } catch (error) {
      return res.status(200).json(error)
    }
}

const editComment = async (req: Request, res: Response): Promise<Response> =>{
  const {id} = req.params;
  const { comment} =req.body;
    try {
      const result = await Comment.update({comment}, {where:{id}})
      return res.status(200).json(result)
    } catch (error) {
      return res.status(200).json(error)
    }
}

const deleteComment = async (req: Request, res: Response): Promise<Response> =>{
  const {id} = req.params;
  try {
      const result = await Comment.destroy({where:{id}})
      return res.status(200).json(result)
    } catch (error) {
      return res.status(200).json(error)
    }
}

const getPostComments = async (req: Request, res: Response): Promise<Response> =>{
  const {postId} = req.params;
    try {
      const comments = await Comment.findAll({
        where:{postId},
        attributes: {
          include: [[col('id'), '_id']]
        }
      })
      return res.status(200).json(comments)
    } catch (error) {
      return res.status(200).json(error)
    }  
}

export default {createComment, editComment, deleteComment, getPostComments}