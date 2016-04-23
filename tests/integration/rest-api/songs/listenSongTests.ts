process.env.NODE_ENV = 'test';

import sequelizeFixtures = require('sequelize-fixtures');
import supertest = require('supertest');
import db from '../../../../src/infrastructure/persistence/sequelize/models/index';
const loggedUsersFixtures = require('../common-fixtures/users');
const songsFixtures = require('../common-fixtures/songs');
const MoonSongs = require('../../../../src/index');
const request: any = supertest(MoonSongs.app);
const PATH = (uuid) => `/api/songs/${uuid}/listen`;

before(async () => {
    await MoonSongs.startPromise;
    return await sequelizeFixtures.loadFixtures(loggedUsersFixtures.default.concat(songsFixtures.default), db);
});

describe(`GET ${PATH(':uuid')}`, () => {
    it('Should not get any song', (done) => {
        request
            .get(PATH('9d6a532a-1ac0-424d-8144-93ac65118ea4'))
            .expect(404, {
                error: 'Not Found',
                message: 'Cannot found song',
                statusCode: 404
            }, done);
    });
});

after(async () => {
    await db.User.destroy({ where: { uuid:  { $not: null } } });
    await db.Song.destroy({ where: { uuid:  { $not: null } } });
});
