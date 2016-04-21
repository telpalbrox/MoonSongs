import {User} from "../../domain/models/User";
import jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

export function signUser(user: User): Promise<string> {
    return new Promise<string>((resolve) => {
        jwt.sign({userName: user.userName, uuid: user.uuid}, jwtConfig.secret, {}, (token: string) => {
            resolve(token);
        });
    });
}

export function verifyToken(token: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        jwt.verify(token, jwtConfig.secret, (err) => {
            if(err) {
                return reject(err);
            }
            resolve();
        });
    });
}
