import {UserRespository} from "../../../domain/models/UserRespository";
import {ApplicationService} from "../../../domain/ApplicationService";
import {SignInRequest} from "./SigInRequest";
import {SignInResponse} from "./SignInResponse";
import {errors} from "../../../domain/errors";
import {signUser} from "../../../infrastructure/jwt/jwt";
export class SignInService implements ApplicationService{

    constructor(private userRepository: UserRespository) { }

    static checkRequest(request: SignInRequest) {
        if(!request.userName) {
            throw errors.requiredParameter('userName');
        }
        if(request.userName.constructor !== String) {
            throw errors.badFormat('userName');
        }
        if(!request.password) {
            throw errors.requiredParameter('password');
        }
        if(request.password.constructor !== String) {
            throw errors.badFormat('password');
        }
    }

    async execute(request: SignInRequest): Promise<SignInResponse> {
        SignInService.checkRequest(request);

        const user = await this.userRepository.getByUserName(request.userName);
        if(!user) {
            throw errors.userNotFound();
        }
        if(!user.comparePassword(request.password)) {
            throw errors.invalidCredentials();
        }

        const token = await signUser(user);
        return {
            token,
            user
        };
    }
}
