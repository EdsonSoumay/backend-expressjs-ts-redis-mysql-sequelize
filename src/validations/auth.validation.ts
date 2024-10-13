import Joi from 'joi'
import { UserAttributes } from '../db/models/User'

export const createUserValidation = (payload: UserAttributes) => {
  const schema = Joi.object({
    email: Joi.string().email().max(40).required(),
    username: Joi.string().min(4).max(10).required(),
    first_name: Joi.string().min(4).max(40).required(),
    last_name: Joi.string().min(4).max(40).allow(""),
    password: Joi.string().min(4).required(),
  })
  return schema.validate(payload)
}

export const createSessionValidation = (payload: UserAttributes) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(10).required(),
    password: Joi.string().min(4).required(),
  })
  return schema.validate(payload)
}