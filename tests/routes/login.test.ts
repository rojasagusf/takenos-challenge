import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import User from '../../lib/models/user.model';
import bcryptjs from 'bcryptjs';

describe('POST /api/login', () => {
  let application: Application;
  const matchJwt = (token: string) => {
    const jwtRegex = /^[\w-]*\.[\w-]*\.[\w-]*$/;
    return jwtRegex.test(token);
  };

  before(async function () {
    application = start();
    return Promise.all([
      User.create({
        id: 1,
        email: 'test@example.com',
        password: (await bcryptjs.hash('12345678', 10)),
      }),
      User.create({
        id: 2,
        email: 'test2@example.com',
        password: (await bcryptjs.hash('12345678', 10)),
      })
    ]);
  });

  after(() => {
    return User.destroy({where: {}});
  });

  it('Should fail with no body', () => {
    return request(application)
      .post('/api/login')
      .send({})
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_fields');
      });
  });

  it('Should fail with invalid fields in body', () => {
    return request(application)
      .post('/api/login')
      .send({
        email: 'test123@example.com',
        password: '123'
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_fields');
      });
  });

  it('Should fail with user not exists', () => {
    return request(application)
      .post('/api/login')
      .send({
        email: 'test123@example.com',
        password: 'passWrong'
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('user_not_exists');
        response.body.message.should.be.equal('User not exists');
      });
  });

  it('Should fail with invalid authentication', () => {
    return request(application)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'passWrong'
      })
      .set('Accept', 'application/json')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_authentication');
        response.body.message.should.be.equal('Invalid authentication');
      });
  });

  it('Should login a user', () => {
    return request(application)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: '12345678'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then(async(response) => {
        matchJwt(response.body.token).should.be.equal(true);
        response.body.user.id.should.be.equal(1);
        response.body.user.email.should.be.equal('test@example.com');
      });
  });
});
