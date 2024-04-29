import { Request, Response } from "express";

class HelloController{

    async helloWorld(req: Request, res: Response){
        res.json("OK");
    }

}

export default new HelloController();