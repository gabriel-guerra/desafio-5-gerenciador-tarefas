import { TaskEnums } from "../enums/task.enum";
import taskRepository from "../repository/task.repository";
import { taskType } from "../types/task.type";

class TaskService{

    async createTask(task: taskType){

        const result = await Promise.all([this.checkMissingData(task), this.checkInvalidData(task), this.checkDataNotEmpty(task)]);

        if(!result.some(item => item !== null)){

            try{
                return await taskRepository.executeCreateTask(task);
            }catch(error){
                console.error(error);
                return TaskEnums.TASK_NOT_CREATED;
            }

        }else{
            return TaskEnums.TASK_NOT_CREATED;
        }
        
    }

    async findTaskById(id: any){
        return await taskRepository.executeFindById(id);
    }

    async findAllTasks(){
        
        const result = await taskRepository.executeFindAll();
        return result.length > 0 ? result : null;

    }

    async findTaskRegex(key: string, value: any){
        
        if (key && value){
            const text = `{ "${key}": { "$regex": "${value}" } }`;
            const search = JSON.parse(text);
            
            return await taskRepository.executeFind(search);
        }else{
            return null;
        }
        
    }

    async findTaskFilterCategory(filter: any){

        const allTasks = await this.findAllTasks();

        if (allTasks){
            const result = allTasks.filter(item => item.category === filter);
            return result.length === 0 ? null : result;
        }

    }

    async findTaskFilterStatus(filter: any){

        const allTasks = await this.findAllTasks();

        if (allTasks){
            const result = allTasks.filter(item => item.status === filter);
            return result.length === 0 ? null : result;
        }

    }

    async findTaskFilterDate(filter: any){

        let startDate = new Date(filter.startDate);
        let endDate = new Date(filter.endDate);

        const allTasks = await this.findAllTasks();

        if (allTasks){
            const result = allTasks.filter(item => item.conclusionDate! < endDate && item.conclusionDate! > startDate);
            return result.length === 0 ? null : result;
        }

    }

    async countTaskOfUser(user: string){

        const userTasks = await this.findTaskRegex('associatedUser', user);

        return userTasks !== null ? userTasks.length : null;

    }

    async findMostRecentTask(user: string){

        const userTasks = await this.findTaskRegex('associatedUser', user);

        if(userTasks){

            const mostRecent = userTasks.reduce((taskAnterior, taskAtual) => {
                return taskAnterior.creationDate > taskAtual.creationDate ? taskAnterior : taskAtual;
            });

            return mostRecent !== null ? mostRecent : null;
            
        }else{
            return null;
        }

    }

    async findLeastRecentTask(user: string){

        const userTasks = await this.findTaskRegex('associatedUser', user);

        if(userTasks){

            const leastRecent = userTasks.reduce((taskAnterior, taskAtual) => {
                return taskAnterior.creationDate < taskAtual.creationDate ? taskAnterior : taskAtual;
            });

            return leastRecent !== null ? leastRecent : null;
            
        }else{
            return null;
        }

    }

    async findAvgConclusion(){
        const allTasks = await this.findAllTasks();

        if (allTasks){
            const daysToConclusion = allTasks.map(item => {
                const diff = (item.conclusionDate!.getTime() - item.creationDate!.getTime()) / (1000 * 3600 * 24);
                return diff;
            });
                
            const soma = daysToConclusion.reduce((v1, v2) => v1 + v2, 0);
            return (soma/daysToConclusion.length);
        }
    }

    async findBiggestDescription(){
        const allTasks = await this.findAllTasks();

        if(allTasks){

            const biggestDesc = allTasks.reduce((taskAnterior, taskAtual) => {
                return taskAnterior.description.length > taskAtual.description.length ? taskAnterior : taskAtual;
            });

            return biggestDesc !== null ? biggestDesc : null;
            
        }else{
            return null;
        }

    }

    async groupByCategory(){
        
        const result = await taskRepository.executeGroupByCategory();
        const format = result.map(r => {
            return {categoria: r._id, quantidade: r.quantidade}
        })

        return format;

    }

    async updateTask(id: any, newTask: taskType){
        const result = await Promise.all([this.checkInvalidData(newTask), this.checkDataNotEmpty(newTask)]);

        if (!result.some(item => item !== null)){
            return await taskRepository.executeUpdateTask(id, newTask);
        }else{
            return TaskEnums.TASK_NOT_UPDATED;
        }
    }

    async deleteTask(id: any){
        const filter = await taskRepository.executeFindById(id);

        if (filter){
            return await taskRepository.executeDeleteTask(filter);
        }else{
            return TaskEnums.TASK_NOT_FOUND;
        }
        
    }


    

    async checkInvalidData(data: any){
        const schemaKeys = await taskRepository.getSchemaKeys();
        const dataKeys = Object.keys(data);

        const missingKeys = dataKeys.filter(field => !schemaKeys.includes(field));

        return missingKeys.length > 0 ? missingKeys : null;
    }

    async checkMissingData(data: any){
        const schemaKeys = await taskRepository.getSchemaKeys();
        const dataKeys = Object.keys(data);

        const invalidKeys = schemaKeys.filter(field => !dataKeys.includes(field));

        return invalidKeys.length > 0 ? invalidKeys : null;
    }

    async checkDataNotEmpty(data: any){
        const entries = Object.entries(data);

        const emptyValues = entries.filter(entry => entry[1] === "");
        const emptyKeys = emptyValues.map(entry => entry[0]);

        /* if (emptyKeys.length === 1 && emptyKeys[0] === "conclusionDate"){
            return null;
        } */

        return emptyKeys.length > 0 ? emptyKeys : null;
    }


}

export default new TaskService();