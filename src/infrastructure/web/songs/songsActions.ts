import { get as axiosGet } from 'axios';
import {SongsResponse} from "../common/interfaces/apiResponses";
const actions = {
    SONGS_REQUEST: 'SONGS_REQUEST',
    SONGS_SUCCESS: 'SONGS_SUCCESS',
    SONGS_FAIL: 'SONGS_FAIL'
};

const getSongs = (page: number = 1) => {
    return async (dispatch) => {
        try {
            dispatch({ type: actions.SONGS_REQUEST });
            const response = await axiosGet<SongsResponse>('/api/songs', {
                headers: {
                    'x-access-token': JSON.parse(window.localStorage.getItem('user')).token
                }
            });
            response.data.page = page;
            dispatch(Object.assign(response.data, { type: actions.SONGS_SUCCESS }));
        } catch(err) {
            console.error(err);
            dispatch({ type: actions.SONGS_FAIL });
        }
    };
};

export { actions, getSongs };
