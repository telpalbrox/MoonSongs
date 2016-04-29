import { post as axiosPost } from 'axios';
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
        }
    };
};

export {
    actions,
    login
};
