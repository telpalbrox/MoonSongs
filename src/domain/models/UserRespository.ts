import {User} from "./User";
export interface UserRespository {
    getByUserName(userName: string): Promise<User>;
    create(userName: string, password: string, admin?: boolean): Promise<User>;
    findAll(): Promise<{ users: User[] }>;
    count(): Promise<number>;
    remove(id: number): Promise<any>;
}
