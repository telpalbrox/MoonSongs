import {Reducer, Action} from "redux/index";
import {actions as loginActions} from './loginActions';

interface LoginState {
    userName?: string;
    password?: string;
    loading?: boolean;
}

const initialState = {};

const reducer: Reducer<LoginState> = (state = initialState, action: Action) => {
    switch(action.type) {
        case loginActions.LOGIN_REQUEST:
            return Object.assign({}, state, { loading: true });
        case loginActions.LOGIN_SUCCESS:
        case loginActions.LOGIN_FAIL:
            return Object.assign({}, state, { loading: false });
        default:
            return state;
    }
};

export default reducer;
