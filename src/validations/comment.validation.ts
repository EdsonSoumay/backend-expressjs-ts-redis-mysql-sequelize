import Joi from 'joi'
import { CommentAttributes } from '../db/models/comment'

export const createCommentValidation = (payload: CommentAttributes) => {
  const schema = Joi.object({
    comment: Joi.string().required(),
    post_id: Joi.number().required(),
    user_id: Joi.number().required().messages({
      'any.required': 'category is required.',
    }),
    photo: Joi.string().allow(null).optional(),  // Bisa null atau string
  })
  return schema.validate(payload)
}