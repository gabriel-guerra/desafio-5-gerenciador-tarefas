import categoryModel, { schemaData } from "../model/category.model"
import { categoryType } from "../types/category.type";

class CategoryRepository{
    
    async executeCreateCategory(category: categoryType){
        return categoryModel.create(category);
    }
    
    async executeFindById(id: any){
        return id.length === 24 ? categoryModel.findById(id) : null;
    }

    async executeFindAll(){
        return categoryModel.find();
    }

    async executeFind(param: any){
        return categoryModel.find(param);
    }

    // usar função findAndUpdate
    async executeUpdateCategory(id: any, category: categoryType){
        return categoryModel.findByIdAndUpdate(id, category, { new: true });
    }

    async executeDeleteCategory(filter: any){
        return categoryModel.deleteOne(filter);
    }

    async getSchemaKeys(){
        return Object.keys(schemaData);
    }

}

export default new CategoryRepository();