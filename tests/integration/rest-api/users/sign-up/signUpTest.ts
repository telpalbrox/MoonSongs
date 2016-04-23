process.env.NODE_ENV = 'test';

import sequelizeFixtures = require('sequelize-fixtures');
import supertest = require('supertest');
import chai = require('chai');
import db from '../../../../../src/infrastructure/persistence/sequelize/models/index';
const signInFixtures = require('./signUpFixtures.json');
const MoonSongs = require('../../../../../src/index');
const request: any = supertest(MoonSongs.app);
const expect = chai.expect;
const PATH = '/api/signup';

before(async () => {
    await MoonSongs.startPromise;
    return await sequelizeFixtures.loadFixtures(signInFixtures, db);
});

describe(`POST ${PATH}`, () => {
    it('Should register and get login token', (done) => {
        request
            .post(PATH)
            .send({
                userName: 'newUser',
                password: 'patata'
            })
            .expect((res) => {
                expect(res.body.token).to.be.string;
                expect(res.body.user.uuid).to.be.string;
                delete res.body.token;
                delete res.body.user.uuid;
            })
            .expect(200, {
                user: {
                    userName: 'newUser'
                }
            }, done);
    });

    it('Should get register error if user exists', (done) => {
        request
            .post(PATH)
            .send({
                userName: 'testUser',
                password: 'patata'
            })
            .expect(409, {
                error: 'Conflict',
                message: 'An user with that userName already exists',
                statusCode: 409
            }, done);
    });

});

after(async () => {
    await db.User.destroy({ where: { uuid:  { $not: null } } });
});
