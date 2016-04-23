process.env.NODE_ENV = 'test';

import sequelizeFixtures = require('sequelize-fixtures');
import supertest = require('supertest');
import chai = require('chai');
import db from '../../../../../src/infrastructure/persistence/sequelize/models/index';
const signInFixtures = require('./signInFixtures.json');
const MoonSongs = require('../../../../../src/index');
const request: any = supertest(MoonSongs.app);
const expect = chai.expect;
const PATH = '/api/login';

before(async () => {
    await MoonSongs.startPromise;
    return await sequelizeFixtures.loadFixtures(signInFixtures, db);
});

describe(`POST ${PATH}`, () => {
    it('Should get login token and user', (done) => {
        request
            .post(PATH)
            .send({
                userName: 'testUser',
                password: 'patata'
            })
            .expect((res) => {
                expect(res.body.token).to.be.string;
                delete res.body.token;
            })
            .expect(200, {
                user: {
                    userName: 'testUser',
                    uuid: '4daca394-1ee1-4db6-9447-b3dd97ed3884'
                }
            }, done);
    });

    it('Should get login error if user don\'t exists', (done) => {
        request
            .post(PATH)
            .send({
                userName: 'asdfasdf',
                password: 'patata'
            })
            .expect(401, {
                error: 'Unauthorized',
                message: 'Cannot found user',
                statusCode: 401
            }, done);
    });

    it('Should get login error if password is wrong', (done) => {
        request
            .post(PATH)
            .send({
                userName: 'testUser',
                password: 'dasf'
            })
            .expect(401, {
                error: 'Unauthorized',
                message: 'Wrong user / password',
                statusCode: 401
            }, done);
    });
});

after(async () => {
    await db.User.destroy({ where: { uuid:  { $not: null } } });
});
