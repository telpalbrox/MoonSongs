import loginRoutes from './loginRoutes';
import songRoutes from './songsRoutes';
import userRoutes from './userRoutes';
import {Express} from "express";
import express = require("express");
import {Router} from "express-serve-static-core";

export default function (router: Router) {
    const loginRouter = express.Router();
    loginRoutes(loginRouter);
    router.use(loginRouter);
    
    const userRouter = express.Router();
    userRoutes(userRouter);
    router.use('/users', userRouter);

    const songsRouter = express.Router();
    songRoutes(songsRouter);
    router.use('/songs', songsRouter);
}
