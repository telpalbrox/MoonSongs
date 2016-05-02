const actions = {
    SAVE_USER: 'SAVE_USER',
    REMOVE_USER: 'REMOVE_USER'
};

const saveUser = (uuid: string, userName: string, token: string) => {
    return { type: actions.SAVE_USER, uuid, userName, token };
};

const removeUser = () => {
    return { type: actions.REMOVE_USER };
};

export  { actions, saveUser, removeUser };
