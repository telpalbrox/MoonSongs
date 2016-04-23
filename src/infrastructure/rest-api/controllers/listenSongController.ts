import {Request, Response} from "express";
import {GetSongService} from "../../../application/song/GetSongService";
import {SequelizeSongRespository} from "../../persistence/sequelize/SequelizeSongRespository";
import errorHandler from '../errorHandler';
export default async function (req: Request, res: Response) {
    try {
        const getSongService = new GetSongService(SequelizeSongRespository.getInstance());
        const song = await getSongService.execute(req.params.uuid);
        res.sendFile(song.relativePath);
    } catch(err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
