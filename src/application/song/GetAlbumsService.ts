import {SongsRepository} from "../../domain/models/SongsRepository";
import {ApplicationService} from "../../domain/ApplicationService";
import _ = require('lodash');
export class GetAlbumsService implements ApplicationService {
    constructor(private songsRepository: SongsRepository) { }

    async execute(): Promise<any> {
        const songs = await this.songsRepository.findAll();
        const groupedSongs = _.groupBy(songs.songs, 'album');
        const total = Object.keys(groupedSongs).length;
        const albums = Object.keys(groupedSongs).map((album) => {
            return {
                artist: groupedSongs[album][0].artist,
                album,
                songs: groupedSongs[album]
            };
        });
        return {
            total,
            albums
        };
    }
}
