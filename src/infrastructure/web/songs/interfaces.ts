import {PaginatedState} from "../common/reducers/paginate";
import {Song} from "../../../domain/models/Song";

export interface SongsState extends PaginatedState {
    songs: Song[]
}
