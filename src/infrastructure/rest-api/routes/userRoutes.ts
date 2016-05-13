import {Router} from "express";
import getAllUsersController from '../controllers/getAllUsersController';
import removeUserController from '../controllers/removeUserController'
export default function(router: Router) {
    router.delete('/:id', removeUserController);

    router.get('/', getAllUsersController);
}
