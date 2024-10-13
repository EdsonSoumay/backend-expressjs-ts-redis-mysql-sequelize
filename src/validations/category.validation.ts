import Joi from "joi"
import { CategoryAttributes } from "../db/models/category"

export const createCategoryValidation = (payload: CategoryAttributes) => {
    const schema = Joi.object({
        category_description: Joi.string().required(),
    })
    return schema.validate(payload)
  }

  export const updateCategoryValidation = (payload: CategoryAttributes) => {
    const schema = Joi.object({
        category_description: Joi.string().required(),
    })
    return schema.validate(payload)
  }