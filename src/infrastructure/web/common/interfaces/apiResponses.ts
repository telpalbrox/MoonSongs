import AxiosXHR = Axios.AxiosXHR;
import {Song} from "../../../../domain/models/Song";
export interface LoginResponse {
    token: string;
    user: {
        userName: string,
        uuid: string
    }
}

export interface SongsResponse {
    songs: Song[];
    page: number;
    total: number;
}
