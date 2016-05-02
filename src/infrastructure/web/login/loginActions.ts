import { post as axiosPost } from 'axios';
import {openError} from "../moonSongsActions";
const actions = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAIL: 'LOGIN_FAIL'
};

const login = (userName: string, password: string) => {
    return async (dispatch: Function) => {
        try {
            dispatch({ type: actions.LOGIN_REQUEST });
            await axiosPost('api/login', { userName, password });
            dispatch({ type: actions.LOGIN_SUCCESS });
        } catch(err) {
            dispatch({ type: actions.LOGIN_FAIL });
            dispatch(openError(err.data.message));
        }
    };
};

export {
    actions,
    login
};
