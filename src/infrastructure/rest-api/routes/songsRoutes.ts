import {Router} from "express";
import getSongsController from '../controllers/getSongsController';
import {authenticate} from "../middleware/authenticate";
import getAlbumsController from '../controllers/getAlbumsController';
import getArtistsController from '../controllers/getArtistsController';
import listenSongController from '../controllers/listenSongController';
export default function(router: Router) {
    router.get('/', authenticate, getSongsController);
    router.get('/albums', authenticate, getAlbumsController);
    router.get('/artists', authenticate, getArtistsController);
    router.get('/:uuid/listen', listenSongController);
}
