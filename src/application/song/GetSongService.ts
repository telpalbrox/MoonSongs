import {ApplicationService} from "../../domain/ApplicationService";
import {Song} from "../../domain/models/Song";
import {SongsRepository} from "../../domain/models/SongsRepository";
import {errors} from "../../domain/Errors";
export class GetSongService implements ApplicationService {
    constructor(private songsRespository: SongsRepository) { }
    
    async execute(uuid: string): Promise<Song> {
        const song = await this.songsRespository.getByUuid(uuid);
        if(!song) {
            throw errors.songNotFound();
        }
        return song;
    }
}
