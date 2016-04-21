import {SongsRepository} from "../../domain/models/SongsRepository";
import {ApplicationService} from "../../domain/ApplicationService";
import {PaginatedRequest} from "../PaginatedRequest";
import {Song} from "../../domain/models/Song";
export class GetSongsService implements ApplicationService {
    constructor(private songsRepository: SongsRepository) { }

    async execute(request: PaginatedRequest): Promise<{songs: Song[], total: number}> {
        return await this.songsRepository.findAll(request.limit, request.offset);
    }
}
