import { Request, Response } from "express";
import { createCategoryValidation, updateCategoryValidation } from "../validations/category.validation";
import { createCategoryService, deleteCategoryService, getCategoriesService, editCategoryService } from "../services/category.service";

// Create a new category
const createCategory = async (req: Request, res: Response): Promise<Response> => {
	const { error, value } = createCategoryValidation(req.body)
	if(error){
		console.log("error validation:",error.details[0].message)
		return res.status(404).send({message: error.details[0].message })
	}

  try {
    const { category_description} = value;
    await createCategoryService(category_description)
    return res.status(200).send({ message: 'successfully get category'});
  } catch (error:any) {
    return res.status(500).send({ error: error.message });
  }
};

// Edit a category by ID
const editCategory = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { error, value } = updateCategoryValidation(req.body)
	if(error){
		console.log("error validation:",error.details[0].message)
		return res.status(404).send({message: error.details[0].message })
	}

  try {
    const { category_description } = value;
    await editCategoryService(category_description, id)
    return res.status(200).send({ message: 'successfully edit category'});
  } catch (error:any) {
    return res.status(500).send({ error: error.message });
  }
};

// Delete a category by ID
const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  
  try {
    await deleteCategoryService(id)
    return res.status(200).send({ message: 'successfully delete category'});
  } catch (error:any) {
    return res.status(500).send({ error: error.message });
  }
};

// Get all categories
const getCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await getCategoriesService()
    return res.status(200).send({ message: 'successfully get categories', data: result});
  } catch (error:any) {
    return res.status(500).send({ error: error.message });
  }
};

export default { createCategory, editCategory, deleteCategory, getCategories };