import {Router} from "express";
import getSongsController from '../controllers/getSongsController';
import {authenticate} from "../middleware/authenticate";
export default function(router: Router) {
    router.get('/songs', authenticate, getSongsController);
}
