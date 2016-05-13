import { Request, Response } from "express";
import errorHandler from '../errorHandler';
import {GetAllUsersService} from "../../../application/user/GetAllUsersService";
import {SequelizeUserRepository} from "../../persistence/sequelize/SequelizeUserRepository";
export default async function(req: Request, res: Response) {
    try {
        const getAllUsersService = new GetAllUsersService(SequelizeUserRepository.getInstance());   
        const users = await getAllUsersService.execute();
        res.json(users);
    } catch(err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
