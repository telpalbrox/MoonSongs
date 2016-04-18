import bcrypt = require('bcrypt');
import {User} from "../../../domain/models/User";
import {UserRespository} from "../../../domain/models/UserRespository";
import db from './models/index';
export class SequelizeUserRepository implements UserRespository {
    private static instance: SequelizeUserRepository = null;
    
    static getInstance(): SequelizeUserRepository {
        if(!SequelizeUserRepository.instance) {
            SequelizeUserRepository.instance = new SequelizeUserRepository();
        }
        return SequelizeUserRepository.instance;
    }
    
    constructor() { }
    
    async getByUserName(userName: string): Promise<User> {
        const sequelizeUser = await db.User.findOne({ where: { userName } });
        if(!sequelizeUser) {
            return null;
        }
        return new User(sequelizeUser.uuid, sequelizeUser.userName, sequelizeUser.password);
    }

    async create(userName, password): Promise<User> {
        const sequelizeUser = await db.User.create({ userName: userName, password: bcrypt.hashSync(password, 8) });
        return new User(sequelizeUser.uuid, sequelizeUser.userName, sequelizeUser.password);
    }
    
    async count(): Promise<number> {
        return await db.User.count();
    }
    
}
