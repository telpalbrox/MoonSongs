import {Request, Response} from "express";
import errorHandler from '../errorHandler';
import {PaginatedRequest} from "../../../application/PaginatedRequest";
import {GetSongsService} from "../../../application/song/GetSongsService";
import {SequelizeSongRespository} from "../../persistence/sequelize/SequelizeSongRespository";
export default async function(req: Request, res: Response) {
    try {
        const request = new PaginatedRequest(req.query.page, req.query.limit);
        const getSongsService = new GetSongsService(SequelizeSongRespository.getInstance());
        const serviceResult = await getSongsService.execute(request);
        const songsResponse: any = {};
        songsResponse.songs = serviceResult.songs.map((song) => song.toJSON());
        songsResponse.total = serviceResult.total;
        res.json(songsResponse);
    } catch(err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
