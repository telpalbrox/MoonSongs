import {Reducer, Action} from "redux/index";
import {actions as moonSongsActions, OpenErrorAction} from './moonSongsActions';

export interface MoonSongsContainerState {
    error: boolean;
    errorMessage?: string;
    errorDuration?: number;
}

const initialState = {
    error: false,
    errorMessage: ''
};

const reducer: Reducer<MoonSongsContainerState> = (state = initialState, action: Action) => {
    switch(action.type) {
        case moonSongsActions.OPEN_ERROR:
            const openAction = action as OpenErrorAction;
            return Object.assign({}, state, { error: true, errorDuration: openAction.duration, errorMessage: openAction.message});
        case moonSongsActions.CLOSE_ERROR:
            return Object.assign({}, state, { error: false });
        default:
            return state;
    }
};

export default reducer;
