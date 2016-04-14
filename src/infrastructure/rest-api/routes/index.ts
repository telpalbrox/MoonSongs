import loginRoutes from './loginRoutes';
import {Express} from "express";
import express = require("express");

export default function (app: Express) {
    const loginRouter = express.Router();
    loginRoutes(loginRouter);
    app.use(loginRouter);
}