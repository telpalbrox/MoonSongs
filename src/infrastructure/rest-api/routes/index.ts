import loginRoutes from './loginRoutes';
import songRoutes from './songsRoutes';
import {Express} from "express";
import express = require("express");

export default function (app: Express) {
    const loginRouter = express.Router();
    loginRoutes(loginRouter);
    app.use(loginRouter);

    const songsRouter = express.Router();
    songRoutes(songsRouter);
    app.use(songsRouter);
}
