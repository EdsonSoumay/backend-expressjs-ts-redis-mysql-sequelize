import { Request, Response } from "express";
import { createCommentValidation } from "../validations/comment.validation";
import { createCommentService, editCommentService, deleteCommentService, getPostCommentsService, getPostCommentService } from "../services/comment.service";
import { RoomSocketEmitHelper } from "../helpers/SocketHelper";

const createComment = async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = createCommentValidation(req.body);
    console.log("req.body:",req.body)
    
    if (error) {
        console.log("error validation:", error.details[0].message);
        return res.status(404).send({ message: error.details[0].message });
    }

    try {
        await createCommentService(value);
        const postId = value.post_id;
        if(postId){
            const result = await getPostCommentsService(value?.post_id);
            RoomSocketEmitHelper(`postId-${postId}`, `${postId}-all-comments`, result);
        }
        return res.status(200).json({ message: 'successfully create comment'});
    } catch (error:any) {
        return res.status(500).send({ error: error.message });
    }
};

const editComment = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { comment } = req.body;
    try {
        await editCommentService(id, comment);
        return res.status(200).json({ message: 'successfully edit comment'});
    } catch (error:any) {
        return res.status(500).send({ error: error.message });
    }
};

const deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const findComment = await getPostCommentService(id)
        if(!findComment){
            return res.status(404).send({ message: 'comment does not exist'});
        }

        await deleteCommentService(id);

        const postId = findComment?.post_id.toString()
        if(postId){
            const result = await getPostCommentsService(postId);
            RoomSocketEmitHelper(`postId-${postId}`, `${postId}-all-comments`, result);
        }

        return res.status(200).json({ message: 'successfully delete comments'});
    } catch (error:any) {
        return res.status(500).send({ error: error.message });
    }
};

const getPostComments = async (req: Request, res: Response): Promise<Response> => {
    const { post_id } = req.params;

    try {
        const comments = await getPostCommentsService(post_id);
        return res.status(200).json({ message: 'successfully get comments', data: comments});
    } catch (error:any) {
        return res.status(500).send({ error: error.message });
    }
};

export default { createComment, editComment, deleteComment, getPostComments };