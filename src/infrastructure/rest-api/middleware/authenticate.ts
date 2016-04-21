import boom = require('boom');
import logger = require('winston');
import {Request, Response} from "express";
import {verifyToken} from "../../jwt/jwt";
export async function authenticate(req: Request, res: Response, next: Function) {
    try {
        const token = req.body.token || req.headers['x-access-token'];
        if(!token) {
            return res.status(401).json(boom.unauthorized('No token provided').output.payload);
        }
        await verifyToken(token);
        next();
    } catch(err) {
        if(err.message === 'jwt malformed' || err.message === 'invalid signature') {
            return res.status(403).json(boom.forbidden().output.payload);
        }
        logger.error('Error authenticating user');
        logger.error(err);
        res.status(500).json(boom.badImplementation().output.payload);
    }
}
