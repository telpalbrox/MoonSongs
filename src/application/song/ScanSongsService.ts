import {SongScanner} from "../../domain/SongScanner";
import {ApplicationService} from "../../domain/ApplicationService";
import {ScanSongsRequest} from "./ScanSongsRequest";
import {Song} from "../../domain/models/Song";
import {SongsRepository} from "../../domain/models/SongsRepository";
export class ScanSongsService implements ApplicationService{

    constructor(private songRepository: SongsRepository, private songScanner: SongScanner) { }

    async execute(request: ScanSongsRequest): Promise<Song[]> {
        const songs = await this.songScanner(request.path);
        const createdUuids = await this.songRepository.findOrCreateAll(songs);
        await this.songRepository.removeSongsWhichUuidIsNot(createdUuids);
        return songs;
    }
}
