import {ApplicationService} from "../../domain/ApplicationService";
import {UserRespository} from "../../domain/models/UserRespository";
export class GetAllUsersService implements ApplicationService {
    constructor(private userRepository: UserRespository) { }
    
    async execute() {
        return await this.userRepository.findAll();
    }
}
