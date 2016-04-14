import {SignUpRequest} from "./SignUpRequest";
import {ApplicationService} from "../../../domain/ApplicationService";
import {UserRespository} from "../../../domain/models/UserRespository";
import {SignUpResponse} from "./SignUpResponse";
import {signUser} from '../../../infrastructure/jwt/jwt';
import {errors} from '../../../domain/errors';
export class SignUpService implements ApplicationService {
    
    constructor(private userRepository: UserRespository) { }
    
    async execute(request: SignUpRequest): Promise<SignUpResponse> {
        if(!request.userName) {
            throw errors.requiredParameter('userName');
        }
        if(!request.userName) {
            throw errors.requiredParameter('password');
        }
        let {userName, password} = request;

        const registeredUser = await this.userRepository.getByUserName(userName);
        if(registeredUser) {
            throw errors.userAlreadyExists();
        }

        const user = await this.userRepository.create(userName, password);
        const token = await signUser(user);
        return {
            token,
            user
        }
    }
}
