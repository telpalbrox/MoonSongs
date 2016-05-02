import {Reducer, Action} from "redux/index";
import {actions as userActions} from '../actions/userActions';

export interface UserState {
    userName: string;
    uuid: string;
    token: string;
}

try {
    var localUser = JSON.parse(window.localStorage.getItem('user'));
} catch(err) { }

const initialState = Object.assign({}, localUser);

const reducer: Reducer<UserState> = (state = initialState, action) => {
    switch(action.type) {
        case userActions.SAVE_USER:
            const { userName, uuid, token } = action;
            window.localStorage.setItem('user', JSON.stringify({ userName, uuid, token }));
            return Object.assign({}, state, { userName, uuid, token });
        case userActions.REMOVE_USER:
            window.localStorage.removeItem('user');
            return {};
        default:
            return state;
    }
};

export default reducer;
