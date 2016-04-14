import {Router} from "express";
import signUpController from "../controllers/signUpController";
import signInController from "../controllers/signInController";
export default function(router: Router) {
    router.post('/login', signInController);
    
    router.post('/signup', signUpController);
}
