import {Request, Response} from "express";
import errorHandler from '../errorHandler';
import {SequelizeSongRespository} from "../../persistence/sequelize/SequelizeSongRespository";
import {GetAlbumsService} from "../../../application/song/GetAlbumsService";
export default async function(req: Request, res: Response) {
    try {
        const getAlbumsService = new GetAlbumsService(SequelizeSongRespository.getInstance());
        const serviceResult = await getAlbumsService.execute();
        res.json(serviceResult);
    } catch(err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
