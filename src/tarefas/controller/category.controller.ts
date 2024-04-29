import { Request, Response } from "express";
import categoryService from "../service/category.service";
import { CategoryEnums } from "../enums/category.enum";

class CategoryController{

    async callCreateCategory(req: Request, res: Response){
        return res.status(201).json(await categoryService.createCategory(req.body));
    }

    async callFindCategory(req: Request, res: Response){

        const parameters = Object.keys(req.query);

        if(parameters.length === 0){
            return res.json(await categoryService.findAllCategories());
        }else if(parameters.includes('id')){
            return res.json(await categoryService.findCategoryById(req.query.id));
        }else if (parameters.includes('name')){
            return res.json(await categoryService.findCategory('name', req.query.name));
        }else if (parameters.includes('color')){
            return res.json(await categoryService.findCategory('color', req.query.color));
        }else{
            return res.status(404).send(CategoryEnums.CATEGORY_NOT_FOUND);
        }
    }

    async callUpdateCategory(req: Request, res:Response){

        let result;

        if (req.query.id){
            result = await categoryService.updateCategory(req.query.id, req.body);
        }else{
            res.status(404).send(CategoryEnums.CATEGORY_NOT_FOUND);
        }
        
        return result === CategoryEnums.CATEGORY_NOT_UPDATED ? res.status(400).send(CategoryEnums.CATEGORY_NOT_UPDATED) : res.json(result);
    }

    async callDeleteCategory(req:Request, res:Response){

        let result;

        if (req.query.id){
            result = await categoryService.deleteCategory(req.query.id);
        }else{
            res.status(404).send(CategoryEnums.CATEGORY_NOT_FOUND);
        }

        return result === null ? res.status(404).send(CategoryEnums.CATEGORY_NOT_FOUND) : res.json(result);
    }

    async callFindUserCategories(req:Request, res:Response){
        const result = await categoryService.findUserCategories(req.params.user);
        return result === null ? res.status(404).send(CategoryEnums.CATEGORY_NOT_FOUND) : res.json(result);
    }
}

export default new CategoryController();