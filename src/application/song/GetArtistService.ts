import {SongsRepository} from "../../domain/models/SongsRepository";
import {ApplicationService} from "../../domain/ApplicationService";
import _ = require('lodash');
import {Artist} from "../../domain/interfaces/Artist";
export class GetArtistService implements ApplicationService {
    constructor(private songsRepository: SongsRepository) { }

    async execute(): Promise<{total: number, artists: Artist[]}> {
        const songs = await this.songsRepository.findAll();
        const groupedSongs = _.groupBy(songs.songs, 'artist');
        const total = Object.keys(groupedSongs).length;
        const artists = Object.keys(groupedSongs).map((artist) => {
            const groupedArtistSongs = _.groupBy(groupedSongs[artist], 'album');
            const albums = Object.keys(groupedArtistSongs).map((album) => {
                return {
                    artist,
                    album,
                    songs: groupedArtistSongs[album]
                };
            });
            return {
                artist,
                albums
            };
        });
        return {
            artists,
            total
        };
    }
}
