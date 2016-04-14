import {User} from "../../../domain/models/User";
export interface SignInResponse {
    token: string;
    user: User;
}
