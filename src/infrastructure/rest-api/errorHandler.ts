import boom = require('boom');
import logger = require('winston');
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
    },
    [errorSymbols.SONG_NOT_FOUND](error) {
        return boom.notFound(error.message);
    }
};

export default function(error): any {
    if(error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
    if(!httpErrors[error.code]) {
        return boom.badImplementation().output.payload;
    }
    return httpErrors[error.code](error).output.payload;
}
