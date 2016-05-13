process.env.NODE_ENV = 'test';

import sequelizeFixtures = require('sequelize-fixtures');
import supertest = require('supertest');
import db from '../../../../src/infrastructure/persistence/sequelize/models/index';
const loggedUsersFixtures = require('../common-fixtures/users');
const token = require('../common-fixtures/tokens').default[0];
const MoonSongs = require('../../../../src/index');
const request: any = supertest(MoonSongs.app);
const PATH = '/api/users/';

before(async () => {
    await sequelizeFixtures.loadFixtures(loggedUsersFixtures.default, db);
    await MoonSongs.startPromise;
});

describe.only(`GET ${PATH}`, () => {
    it('Should get songs', (done) => {
        request
            .get(PATH)
            .set('x-access-token', token)
            .expect((res) => {
                delete res.body.users[0].uuid;
            })
            .expect(200, {
                users: [{
                    userName: 'admin',
                    admin: true
                },{
                    uuid: '4daca394-1ee1-4db6-9447-b3dd97ed3884',
                    userName: 'testUser',
                    admin: true
                }, {
                    uuid: '519caf70-5f1a-4908-98c2-b1abf7810847',
                    userName: 'testUser2',
                    admin: false
                }],
            }, done);
    });
});

after(async () => {
    await db.User.destroy({ where: { uuid:  { $not: null } } });
});
