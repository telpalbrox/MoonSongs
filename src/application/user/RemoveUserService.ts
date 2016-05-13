import {ApplicationService} from "../../domain/ApplicationService";
import {UserRespository} from "../../domain/models/UserRespository";
export class RemoveUserService implements ApplicationService {
    constructor(private userRepository: UserRespository) { }

    async execute(id: number) {
        await this.userRepository.remove(id);
    }
}
