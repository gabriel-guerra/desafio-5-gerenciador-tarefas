import { Request, Response } from "express";
import userService from "../service/user.service";
import { UserEnums } from "../enums/user.enum";

class UserController{

    async callCreateUser(req: Request, res: Response){
        
        return res.status(201).json(await userService.createUser(req.body));
    }

    async callfindUser(req: Request, res: Response){

        const parameters = Object.keys(req.query);

        if(parameters.length === 0){
            return res.json(await userService.findAllUsers());
        }else if(parameters.includes('id')){
            return res.json(await userService.findUserById(req.query.id));
        }else if (parameters.includes('username')){
            return res.json(await userService.findUser('username', req.query.username));
        }else if (parameters.includes('email')){
            return res.json(await userService.findUser('email', req.query.email));
        }else{
            return res.status(404).send(UserEnums.USER_NOT_FOUND);
        }
    }

    async callUpdateUser(req: Request, res: Response){
      
        let result;

        if (req.query.id){
            result = await userService.updateUser(req.query.id, req.body);
        }else{
            res.status(404).send(UserEnums.USER_NOT_FOUND);
        }
        
        return result === UserEnums.USER_NOT_UPDATED ? res.status(400).send(UserEnums.USER_NOT_UPDATED) : res.json(result);
    }

    async callDeleteUser(req: Request, res: Response){

        let result;

        if (req.query.id){
            result = await userService.deleteUser(req.query.id);
        }else{
            res.status(404).send(UserEnums.USER_NOT_FOUND);
        }

        return result === null ? res.status(404).send(UserEnums.USER_NOT_FOUND) : res.json(result);

    }
}

export default new UserController();