import {Reducer, Action} from "redux/index";
import {actions as moonSongsActions, OpenErrorAction} from './moonSongsActions';

export interface MoonSongsContainerState {
    error: boolean;
    errorMessage?: string;
    errorDuration?: number;
    drawerOpen: boolean;
}

const initialState = {
    error: false,
    errorMessage: '',
    drawerOpen: false
};

const reducer: Reducer<MoonSongsContainerState> = (state = initialState, action: Action) => {
    switch(action.type) {
        case moonSongsActions.OPEN_ERROR:
            const openAction = action as OpenErrorAction;
            return Object.assign({}, state, { error: true, errorDuration: openAction.duration, errorMessage: openAction.message});
        case moonSongsActions.CLOSE_ERROR:
            return Object.assign({}, state, { error: false });
        case moonSongsActions.OPEN_DRAWER:
            return Object.assign({}, state, { drawerOpen: true });
        case moonSongsActions.CLOSE_DRAWER:
            return Object.assign({}, state, { drawerOpen: false });
        default:
            return state;
    }
};

export default reducer;
