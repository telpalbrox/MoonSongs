import {ApplicationService} from "../../domain/ApplicationService";
import {UserRespository} from "../../domain/models/UserRespository";
export class CreateAdminService implements ApplicationService {
    constructor(private userRepository: UserRespository) { }
    
    async execute() {
        const numberUsers = await this.userRepository.count();
        if(numberUsers !== 0) {
            return;
        }
        await this.userRepository.create('admin', 'patata', true);
    }
}
