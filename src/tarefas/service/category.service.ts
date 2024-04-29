import { CategoryEnums } from "../enums/category.enum";
import categoryRepository from "../repository/category.repository";
import { categoryType } from "../types/category.type";
import taskService from "./task.service";

class CategoryService{

    async createCategory(category: categoryType){

        const result = await Promise.all([this.checkMissingData(category), this.checkInvalidData(category), this.checkDataNotEmpty(category)]);

        if(!result.some(item => item !== null)){
            return await categoryRepository.executeCreateCategory(category);
        }else{
            return CategoryEnums.CATEGORY_NOT_FOUND;
        }
    }

    async findCategoryById(id: any){
        return await categoryRepository.executeFindById(id);
    }

    async findAllCategories(){
        return await categoryRepository.executeFindAll();
    }

    async findCategory(key: string, value: any){

        const text = `{ "${key}": { "$regex": "${value}" } }`;
        const search = JSON.parse(text);

        return await categoryRepository.executeFind(search);
    }


    async updateCategory(id: any, newCategory: categoryType){
        const promises = await Promise.all([this.checkInvalidData(newCategory), this.checkDataNotEmpty(newCategory)]);

        if (!promises.some(item => item !== null)){
            return await categoryRepository.executeUpdateCategory(id, newCategory);
        }else{
            return CategoryEnums.CATEGORY_NOT_UPDATED;
        }
    }

    async deleteCategory(id: any){
        const filter = await categoryRepository.executeFindById(id);

        if (filter){
            return await categoryRepository.executeDeleteCategory(filter);
        }else{
            return null;
        }
        
    }

    async findUserCategories(user: String){
        const userTasks = await taskService.findTaskRegex('associatedUser', user);
        const categories = userTasks?.map(task => task.category);
        const unique = [...new Set(categories)];

        return unique.length > 0 ? unique : null;
    }




        async checkInvalidData(data: any){
            const schemaKeys = await categoryRepository.getSchemaKeys();
            const dataKeys = Object.keys(data);
    
            const missingKeys = dataKeys.filter(field => !schemaKeys.includes(field));
    
            return missingKeys.length > 0 ? missingKeys : null;
        }
    
        async checkMissingData(data: any){
            const schemaKeys = await categoryRepository.getSchemaKeys();
            const dataKeys = Object.keys(data);
    
            const invalidKeys = schemaKeys.filter(field => !dataKeys.includes(field));
    
            return invalidKeys.length > 0 ? invalidKeys : null;
        }
    
        async checkDataNotEmpty(data: any){
            const entries = Object.entries(data);
    
            const emptyValues = entries.filter(entry => entry[1] === "");
            const emptyKeys = emptyValues.map(entry => entry[0]);
    
            return emptyKeys.length > 0 ? emptyKeys : null;
        }



}

export default new CategoryService();