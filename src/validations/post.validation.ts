import Joi from 'joi'
import { PostAttributes } from '../db/models/post'

export const createPostValidation = (payload: PostAttributes) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    user_id: Joi.number().required(),
    category_id: Joi.number().required().messages({
      'any.required': 'category is required.',
    }),
    photo: Joi.string().allow(null).optional(),  // Bisa null atau string
  })
  return schema.validate(payload)
}

export const updatePostValidation = (payload: PostAttributes) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    user_id: Joi.number().required(),
    category_id: Joi.number().required().messages({
      'any.required': 'category is required.',
    }),
    photo: Joi.string().allow(null).optional(),  // Bisa null atau string
  })
  return schema.validate(payload)
}