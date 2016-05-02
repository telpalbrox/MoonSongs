import {Action} from "redux/index";
const actions = {
    OPEN_ERROR: 'OPEN_ERROR',
    CLOSE_ERROR: 'CLOSE_ERROR'
};

export interface OpenErrorAction extends Action {
    message: string;
    duration: number;
}

const openError = (message, duration = 1500) => {
    return (dispatch: Function) => {
        dispatch({ type: actions.OPEN_ERROR, message , duration});
        setTimeout(() => {
            dispatch({ type: actions.CLOSE_ERROR });
        }, duration);
    };
};

export {
    actions,
    openError
};
