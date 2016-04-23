import {Request, Response} from "express";
import errorHandler from '../errorHandler';
import {SequelizeSongRespository} from "../../persistence/sequelize/SequelizeSongRespository";
import {GetArtistService} from "../../../application/song/GetArtistService";
export default async function(req: Request, res: Response) {
    try {
        const getArtistService = new GetArtistService(SequelizeSongRespository.getInstance());
        const serviceResult = await getArtistService.execute();
        res.json(serviceResult);
    } catch(err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
