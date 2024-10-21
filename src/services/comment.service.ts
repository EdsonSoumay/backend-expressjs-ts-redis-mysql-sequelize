import Comment from "../db/models/comment";
import User from "../db/models/User";

const createCommentService = async (data: any) => {
    const newComment = await Comment.create(data);
    return newComment;
};

const editCommentService = async (id: string, comment: string) => {
    const result = await Comment.update({ comment }, { where: { id } });
    return result;
};

const deleteCommentService = async (id: string) => {
    const result = await Comment.destroy({ where: { id } });
    return result;
};

const getPostCommentsService = async (post_id: any) => {
    const comments = await Comment.findAll({
        where: { post_id },
        include: [{
            model: User,
            as: 'user',
        }],
    });
    return comments;
};

const getPostCommentService = async (id: string) => {
    const comment = await Comment.findOne({
        where: { id },
    });
    return comment;
};

export { createCommentService, editCommentService, deleteCommentService, getPostCommentsService, getPostCommentService};
