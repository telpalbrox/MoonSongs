/// <reference path="../typings/tsd.d.ts" />
import db from './infrastructure/persistence/sequelize/models';
import logger = require('winston');
import {fileSongScanner} from "./infrastructure/file-system/fileSongScanner";
import {ScanSongsService} from "./application/song/ScanSongsService";
import {ScanSongsRequest} from "./application/song/ScanSongsRequest";
import {dirname, resolve} from 'path';
import {SequelizeSongRespository} from "./infrastructure/persistence/sequelize/SequelizeSongRespository";
import {CreateAdminService} from "./application/user/CreateAdminService";
import {SequelizeUserRepository} from "./infrastructure/persistence/sequelize/SequelizeUserRepository";
const config = require('./config/config')[process.env.NODE_ENV || "development"];
async function startMoonSongs() {
    await db.sequelize.sync();
    const scanSongsService = new ScanSongsService(SequelizeSongRespository.getInstance(), fileSongScanner);
    const appDir = dirname(require.main.filename);
    await scanSongsService.execute(new ScanSongsRequest(resolve(appDir, config.music)));
    const createAdminService = new CreateAdminService(SequelizeUserRepository.getInstance());
    createAdminService.execute();
    logger.info('Database updated');
    require('./infrastructure/rest-api/express');
}

startMoonSongs().catch((err) => {
    if(err.stack) {
        console.error(err.stack);
    } else {
        console.error(err);
    }
});   
