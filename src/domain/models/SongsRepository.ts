import {Song} from "./Song";
export interface SongsRepository {
    createAll(songs: Song[]): Promise<any>;
    findOrCreate(song: Song): Promise<string>;
    findOrCreateAll(songs: Song[]): Promise<string[]>;
    removeSongsWhichUuidIsNot(uuids: string[]): Promise<any>;
    findAll(limit?: number, offset?: number): Promise<{songs: Song[], total: number}>;
    getByUuid(uuid: string): Promise<Song>;
}
