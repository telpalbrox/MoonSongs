/// <reference path="../typings/tsd.d.ts" />
import logger = require('winston');
import db from './infrastructure/persistence/sequelize/models';
import {fileSongScanner} from "./infrastructure/file-system/fileSongScanner";
import {ScanSongsService} from "./application/song/ScanSongsService";
import {ScanSongsRequest} from "./application/song/ScanSongsRequest";
import {dirname, resolve} from 'path';
import {SequelizeSongRespository} from "./infrastructure/persistence/sequelize/SequelizeSongRespository";
import {CreateAdminService} from "./application/user/CreateAdminService";
import {SequelizeUserRepository} from "./infrastructure/persistence/sequelize/SequelizeUserRepository";
const config = require('./config/config')[process.env.NODE_ENV || "development"];
let app = require('./infrastructure/rest-api/express').app;
let startPromise;
async function startMoonSongs() {
    await db.sequelize.sync();
    const scanSongsService = new ScanSongsService(SequelizeSongRespository.getInstance(), fileSongScanner);
    const appDir = dirname(require.main.filename);
    await scanSongsService.execute(new ScanSongsRequest(resolve(appDir, config.music)));
    const createAdminService = new CreateAdminService(SequelizeUserRepository.getInstance());
    await createAdminService.execute();
    logger.info('Database updated');
}

startPromise = startMoonSongs().catch((err) => {
    if(err.stack) {
        console.error(err.stack);
    } else {
        console.error(err);
    }
});

module.exports = {
    app,
    startPromise
};