import {User} from "./User";
export interface UserRespository {
    getByUserName(userName: string): Promise<User>;
    create(userName: string, password: string): Promise<User>;
    // findAll(): Promise<User[]>;
    count(): Promise<number>;
}
