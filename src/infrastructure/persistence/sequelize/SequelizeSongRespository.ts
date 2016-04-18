import {Song} from "../../../domain/models/Song";
import {SongsRepository} from "../../../domain/models/SongsRepository";
import db from './models/index';
export class SequelizeSongRespository implements SongsRepository {
    static instance: SequelizeSongRespository;

    static getInstance(): SequelizeSongRespository {
        if(!SequelizeSongRespository.instance) {
            SequelizeSongRespository.instance = new SequelizeSongRespository();
        }
        return SequelizeSongRespository.instance;
    }

    async createAll(songs: Song[]): Promise<any> {
        const plainObjectSongs = songs.map((song) => song.toPlainObject());
        await db.Song.bulkCreate(plainObjectSongs);
    }

    async findOrCreate(song: Song): Promise<string> {
        const [sequelizeSong] = await db.Song.findOrCreate({ where: { title: song.title, album: song.album, artist: song.artist, relativePath: song.relativePath } });
        song.uuid = sequelizeSong.uuid;
        return song.uuid;
    }

    async findOrCreateAll(songs: Song[]): Promise<string[]> {
        const createdUuids = [];
        for(let song of songs) {
            createdUuids.push(await this.findOrCreate(song));
        }
        return createdUuids;
    }

    async removeSongsWhichUuidIsNot(uuids: string[]): Promise<any> {
        await db.Song.destroy({ where: { $not: [ { uuid: uuids } ] } } );
    }
}
