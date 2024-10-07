import { Request, Response } from "express";
import Category from "../db/models/category";

// Create a new category
const createCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category_description} = req.body;
    const newCategory = await Category.create({ category_description });
    return res.status(200).json(newCategory);
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
};

// Edit a category by ID
const editCategory = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { category_description } = req.body;
  
  try {
    const result = await Category.update({ category_description }, { where: { id } });
    return res.status(200).json(result);
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete a category by ID
const deleteCategory = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  
  try {
    const result = await Category.destroy({ where: { id } });
    return res.status(200).json(result);
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
};

// Get all categories
const getCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
  } catch (error:any) {
    return res.status(400).json({ error: error.message });
  }
};

export default { createCategory, editCategory, deleteCategory, getCategories };
