import {User} from "../../../domain/models/User";
export interface SignUpResponse {
    token: string;
    user: User;
}
