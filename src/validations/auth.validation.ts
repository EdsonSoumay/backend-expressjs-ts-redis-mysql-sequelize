import Joi from 'joi'
import { UserAttributes } from '../db/models/User'

export const createUserValidation = (payload: UserAttributes) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(4).required(),
    password: Joi.string().min(4).required(),
  })
  return schema.validate(payload)
}

export const createSessionValidation = (payload: UserAttributes) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
  })
  return schema.validate(payload)
}