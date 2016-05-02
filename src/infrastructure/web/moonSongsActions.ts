import {Action} from "redux/index";
const actions = {
    OPEN_ERROR: 'OPEN_ERROR',
    CLOSE_ERROR: 'CLOSE_ERROR'
};

export interface OpenErrorAction extends Action {
    message: string;
    duration: number;
}

const closeError = () => {
    return { type: actions.CLOSE_ERROR };
};

const openError = (message, duration = 4000) => {
    return (dispatch: Function) => {
        dispatch({ type: actions.OPEN_ERROR, message , duration});
        setTimeout(() => {
            dispatch(closeError());
        }, duration);
    };
};

export {
    actions,
    openError,
    closeError
};
