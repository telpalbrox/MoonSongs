import boom = require('boom');
import {errors, errorSymbols} from '../../domain/errors';

const httpErrors = {
    [errorSymbols.REQUIRED_PARAMETER](error) {
        return boom.badRequest(error.message);
    },
    [errorSymbols.BAD_FORMAT](error) {
        return boom.badRequest(error.message);
    },
    [errors.userAlreadyExists().code](error) {
        return boom.conflict(error.message);
    }
};

export default function(error): Object {
    if(!httpErrors[error.code]) {
        return boom.badImplementation().output.payload;
    }
    return httpErrors[error.code](error).output.payload;
}
