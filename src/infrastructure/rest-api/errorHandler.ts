import boom = require('boom');
import {errorSymbols} from '../../domain/Errors';
import BoomError = Boom.BoomError;

const httpErrors = {
    [errorSymbols.REQUIRED_PARAMETER](error) {
        return boom.badRequest(error.message);
    },
    [errorSymbols.BAD_FORMAT](error) {
        return boom.badRequest(error.message);
    },
    [errorSymbols.USER_ALREADY_EXISTS](error) {
        return boom.conflict(error.message);
    },
    [errorSymbols.INVALID_CREDENTIALS](error) {
        return boom.unauthorized(error.message);
    },
    [errorSymbols.USER_NOT_FOUND](error) {
        return boom.unauthorized(error.message);
    }
};

export default function(error): any {
    if(!httpErrors[error.code]) {
        return boom.badImplementation().output.payload;
    }
    return httpErrors[error.code](error).output.payload;
}
