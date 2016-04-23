import {Router} from "express";
import getSongsController from '../controllers/getSongsController';
import {authenticate} from "../middleware/authenticate";
import getAlbumsController from '../controllers/getAlbumsController';
import getArtistsController from '../controllers/getArtistsController';
export default function(router: Router) {
    router.get('/songs', authenticate, getSongsController);
    router.get('/albums', getAlbumsController);
    router.get('/artists', getArtistsController);
}
