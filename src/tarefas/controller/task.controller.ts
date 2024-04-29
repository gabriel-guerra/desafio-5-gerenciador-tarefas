import { Request, Response } from "express";
import taskService from "../service/task.service";
import { TaskEnums }  from "../enums/task.enum";

class TaskController{

    async callCreateTask(req: Request, res: Response){
        const result = await taskService.createTask(req.body);
        return result !== TaskEnums.TASK_NOT_CREATED ? res.status(201).json(result) : res.status(400).send(result);
    }

    async callFindTaskById(req: Request, res: Response){
        const result = await taskService.findTaskById(req.params.id);
        return result ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindAllTasks(req: Request, res: Response){
        const result = await taskService.findAllTasks();
        return result ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindTasksOfUser(req: Request, res: Response){
        const result = await taskService.findTaskRegex('associatedUser', req.params.associatedUser);
        return result ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindTasksByCategory(req: Request, res: Response){
        const result = await taskService.findTaskFilterCategory(req.params.category);
        return result ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindTasksConcluded(req: Request, res:Response){
        const result =  await taskService.findTaskFilterStatus('Concluída');
        return result !== null ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindTasksPending(req: Request, res:Response){
        const result =  await taskService.findTaskFilterStatus('Pendente');
        return result !== null ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindTaskDateInterval(req:Request, res:Response){
        const result = await taskService.findTaskFilterDate(req.body);
        return result !== null ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_BETWEEN_DATES);
    }

    async callCountUserTasks(req: Request, res:Response){
        const result = await taskService.countTaskOfUser(req.params.user);
        return result !== null ? res.json(result) : res.status(404).send(TaskEnums.ASSOCIATED_USER_NOT_FOUND);
    }

    async callFindMostRecentTask(req: Request, res:Response){
        const result = await taskService.findMostRecentTask(req.params.user);
        return result !== null ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindLeastRecentTask(req: Request, res:Response){
        const result = await taskService.findLeastRecentTask(req.params.user);
        return result !== null ? res.json(result) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callAvgConclusion(req:Request, res:Response){
        const result = await taskService.findAvgConclusion();
        return result !== null ? res.json({"mediaConclusaoDias": result}) : res.status(404).send(TaskEnums.TASK_NOT_FOUND);
    }

    async callFindBiggestDescription(req:Request, res:Response){
        return res.json(await taskService.findBiggestDescription());
    }

    async callGroupByCategory(req:Request, res:Response){
        return res.json(await taskService.groupByCategory());
    }

    async callUpdateTask(req: Request, res: Response){

        let result;

        if (req.params.id){
            result = await taskService.updateTask(req.params.id, req.body);
        }else{
            res.status(404).send(TaskEnums.TASK_NOT_FOUND);
        }
        
        return result === TaskEnums.TASK_NOT_UPDATED ? res.status(400).send(result) : res.json(result);

    }

    async callDeleteTask(req: Request, res: Response){

        let result;

        if(req.params.id){
            result = await taskService.deleteTask(req.params.id);
        }else{
            res.status(404).send(TaskEnums.TASK_NOT_FOUND);
        }

        return result === TaskEnums.TASK_NOT_FOUND ? res.status(404).send(result) : res.json(result);

    }

}

export default new TaskController()