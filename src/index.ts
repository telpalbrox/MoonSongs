/// <reference path="../typings/tsd.d.ts" />
import db from './infrastructure/persistence/sequelize/models';
import logger = require('winston');
db.sequelize.sync().then(() => {
    logger.info('Database updated');
    require('./infrastructure/rest-api/express');
});
