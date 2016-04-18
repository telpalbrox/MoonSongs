import {Song} from "./models/Song";
export interface SongScanner {
    (path: string): Promise<Song[]>;
}
