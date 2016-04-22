import {Song} from "../models/Song";
export interface Album {
    artist: string;
    album: string;
    songs: Song[];
}
