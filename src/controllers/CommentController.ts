import { Request, Response } from "express";
import { createCommentValidation } from "../validations/comment.validation";
import { createCommentService, editCommentService, deleteCommentService, getPostCommentsService } from "../services/comment.service";

const createComment = async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = createCommentValidation(req.body);
    if (error) {
        console.log("error validation:", error.details[0].message);
        return res.status(404).send({ message: error.details[0].message });
    }

    try {
        const newComment = await createCommentService(value);
        return res.status(200).json(newComment);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const editComment = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { comment } = req.body;

    try {
        const result = await editCommentService(id, comment);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const result = await deleteCommentService(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getPostComments = async (req: Request, res: Response): Promise<Response> => {
    const { post_id } = req.params;

    try {
        const comments = await getPostCommentsService(post_id);
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export default { createComment, editComment, deleteComment, getPostComments };