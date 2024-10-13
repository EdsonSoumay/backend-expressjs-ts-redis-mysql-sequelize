import Category from "../db/models/category";

const createCategoryService = async (category_description: any) => {
    const result = await Category.create(category_description);
    return result;
};

const editCategoryService = async (category_description: string, id: string) => {
    const result = await Category.update({ category_description }, { where: { id } });
    return result;
};

const deleteCategoryService = async (id: string) => {
    const result = await Category.destroy({ where: { id } });
    return result;
};

const getCategoriesService = async () => {
    const result = await Category.findAll({});
    return result;
};

export { createCategoryService, deleteCategoryService, getCategoriesService, editCategoryService};