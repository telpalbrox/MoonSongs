process.env.NODE_ENV = 'test';

import sequelizeFixtures = require('sequelize-fixtures');
import supertest = require('supertest');
import db from '../../../../src/infrastructure/persistence/sequelize/models/index';
const loggedUsersFixtures = require('../common-fixtures/users');
const songsFixtures = require('../common-fixtures/songs');
const token = require('../common-fixtures/tokens').default[0];
const MoonSongs = require('../../../../src/index');
const request: any = supertest(MoonSongs.app);
const PATH = '/api/songs/';

before(async () => {
    await MoonSongs.startPromise;
    return await sequelizeFixtures.loadFixtures(loggedUsersFixtures.default.concat(songsFixtures.default), db);
});

describe(`GET ${PATH}`, () => {
    it('Should get songs', (done) => {
        request
            .get(PATH)
            .set('x-access-token', token)
            .expect(200, {
                songs: [{
                        uuid: '0321eb0a-d88d-4f29-ba3b-2c34b815e0c3',
                        title: 'song1',
                        album: 'album1',
                        artist: 'artist1',
                        url: 'artist1/album1/song1/listen'
                    }, {
                        uuid: '12fdb639-3de5-40cf-8706-f24a475a3987',
                        title: 'song2',
                        album: 'album2',
                        artist: 'artist2',
                        url: 'artist2/album2/song2/listen'
                    }, {
                        uuid: 'e29e3d6b-dffc-4d5b-ad91-d59d73b14a5b',
                        title: 'song3',
                        album: 'album3',
                        artist: 'artist3',
                        url: 'artist3/album3/song3/listen'
                    }, {
                        uuid: 'e5f41858-927d-4e5b-95bd-1273e3cf7f8e',
                        title: 'song4',
                        album: 'album4',
                        artist: 'artist4',
                        url: 'artist4/album4/song4/listen'
                    }],
                total: 4
            }, done);
    });

    it('Should get limited songs', () => {
        request
            .get(PATH)
            .query({ limit: 1 })
            .set('x-access-token', token)
            .expect(200, {
                songs: [{
                    uuid: '0321eb0a-d88d-4f29-ba3b-2c34b815e0c3',
                    title: 'song1',
                    album: 'album1',
                    artist: 'artist1',
                    url: 'artist1/album1/song1/listen'
                }],
                total: 4
            });
    });
    
    it('Should get paginated songs', () => {
        request
            .get(PATH)
            .query({ limit: 1, page: 3 })
            .set('x-access-token', token)
            .expect(200, {
                songs: [{
                    uuid: 'e29e3d6b-dffc-4d5b-ad91-d59d73b14a5b',
                    title: 'song3',
                    album: 'album3',
                    artist: 'artist3',
                    url: 'artist3/album3/song3/listen'
                }],
                total: 4
            });
    });
});

after(async () => {
    await db.User.destroy({ where: { uuid:  { $not: null } } });
    await db.Song.destroy({ where: { uuid:  { $not: null } } });
});
