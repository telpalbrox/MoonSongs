import { Request, Response } from "express";
import errorHandler from '../errorHandler';
import {SequelizeUserRepository} from "../../persistence/sequelize/SequelizeUserRepository";
import {RemoveUserService} from "../../../application/user/RemoveUserService";
export default async function(req: Request, res: Response) {
    try {
        const removeUserService = new RemoveUserService(SequelizeUserRepository.getInstance());
        await removeUserService.execute(parseInt(req.params.id));
        res.sendStatus(204);
    } catch(err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
