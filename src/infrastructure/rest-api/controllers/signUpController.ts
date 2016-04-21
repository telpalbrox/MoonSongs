import {Request, Response} from "express";
import {SignUpRequest} from "../../../application/user/signUp/SignUpRequest";
import {SignUpService} from "../../../application/user/signUp/SignUpService";
import {SequelizeUserRepository} from "../../persistence/sequelize/SequelizeUserRepository";
import errorHandler from '../errorHandler';
export default async function signUpController(req: Request, res: Response) {
    try {
        const request = new SignUpRequest(req.body.userName, req.body.password);
        const signUpService = new SignUpService(SequelizeUserRepository.getInstance());
        const {token, user} = await signUpService.execute(request);
        res.json({
            token,
            user: user.getTokenInfo()
        });
    } catch (err) {
        const httpError = errorHandler(err);
        res.status(httpError.statusCode).json(httpError);
    }
}
