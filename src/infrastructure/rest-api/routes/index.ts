import loginRoutes from './loginRoutes';
import songRoutes from './songsRoutes';
import {Express} from "express";
import express = require("express");
import {Router} from "express-serve-static-core";

export default function (router: Router) {
    const loginRouter = express.Router();
    loginRoutes(loginRouter);
    router.use(loginRouter);

    const songsRouter = express.Router();
    songRoutes(songsRouter);
    router.use(songsRouter);
}
