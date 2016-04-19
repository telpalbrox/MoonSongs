import logger = require('winston');
import boom = require('boom');
import {Request, Response} from "express";
import {SequelizeUserRepository} from "../../persistence/sequelize/SequelizeUserRepository";
import errorHandler from '../errorHandler';
import {SignInRequest} from "../../../application/user/signIn/SigInRequest";
import {SignInService} from "../../../application/user/signIn/SignInService";
export default async function signInController(req: Request, res: Response) {
    try {
        const request = new SignInRequest(req.body.userName, req.body.password);
        const signUpService = new SignInService(SequelizeUserRepository.getInstance());
        const {token, user} = await signUpService.execute(request);
        res.json({
            token,
            user: user.getTokenInfo()
        });
    } catch(err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
