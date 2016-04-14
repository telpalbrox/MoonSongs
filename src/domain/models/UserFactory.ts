import {User} from "./User";
export interface UserFactory {
    build(userName: string, password: string): User;
}
