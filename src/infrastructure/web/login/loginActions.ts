import { post as axiosPost } from 'axios';
import { push } from 'react-router-redux';
import {openError} from "../moonSongsActions";
import { saveUser } from '../common/actions/userActions';
import {LoginResponse} from "../common/interfaces/apiResponses";

const actions = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAIL: 'LOGIN_FAIL'
};

const login = (userName: string, password: string) => {
    return async (dispatch: Function) => {
        try {
            dispatch({ type: actions.LOGIN_REQUEST });
            const response = await axiosPost<LoginResponse>('api/login', { userName, password });
            dispatch({ type: actions.LOGIN_SUCCESS });
            dispatch(saveUser(response.data.user.uuid, response.data.user.userName, response.data.token));
            dispatch(push('/songs'));
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
