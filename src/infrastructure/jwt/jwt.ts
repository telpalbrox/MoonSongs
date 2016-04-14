import {User} from "../../domain/models/User";
import jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

export function signUser(user: User): Promise<string> {
    return new Promise<string>((resolve) => {
        jwt.sign({userName: user.userName, uuid: 'asdfsadf'}, jwtConfig.secret, {}, (token: string) => {
            resolve(token);
        });
    });
}
