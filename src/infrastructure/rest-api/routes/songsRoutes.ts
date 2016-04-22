import {Router} from "express";
import getSongsController from '../controllers/getSongsController';
import {authenticate} from "../middleware/authenticate";
import getAlbumsController from '../controllers/getAlbumsController';
export default function(router: Router) {
    router.get('/songs', authenticate, getSongsController);
    router.get('/albums', getAlbumsController);
}
