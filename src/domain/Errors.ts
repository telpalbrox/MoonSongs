export interface DomainError {
    message: string;
    code: number;
}

const errorSymbols = {
    REQUIRED_PARAMETER: Symbol(),
    BAD_FORMAT: Symbol(),
    USER_ALREADY_EXISTS: Symbol(),
    USER_NOT_FOUND: Symbol(),
    INVALID_CREDENTIALS: Symbol(),
    MUSIC_FOLDER_NOT_FOUND: Symbol(),
    SONG_NOT_FOUND: Symbol()
};

const errors = {
    requiredParameter(parameterName?) {
        return {
            code: errorSymbols.REQUIRED_PARAMETER,
            message: `${parameterName} is a required parameter`
        };
    },
    badFormat(parameterName?) {
        return {
            code: errorSymbols.BAD_FORMAT,
            message: `${parameterName}: bad type / format`
        };
    },
    userAlreadyExists() {
        return {
            code: errorSymbols.USER_ALREADY_EXISTS,
            message: `An user with that userName already exists`
        };
    },
    userNotFound() {
        return {
            code: errorSymbols.USER_NOT_FOUND,
            message: `Cannot found user`
        };
    },
    invalidCredentials() {
        return {
            code: errorSymbols.INVALID_CREDENTIALS,
            message: `Wrong user / password`
        };
    },
    songNotFound() {
        return {
            code: errorSymbols.SONG_NOT_FOUND,
            message: `Cannot found song`
        };
    }
};

export {errors, errorSymbols};
