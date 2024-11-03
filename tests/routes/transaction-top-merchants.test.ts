import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import Transaction from '../../lib/models/transaction.model';
import User from '../../lib/models/user.model';
import bcryptjs from 'bcryptjs';

describe('POST /api/transactions/top-merchants', () => {
  let application: Application;


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
    ])
      .then(() => {
        return Promise.all([
          Transaction.create({
            id: 1,
            date: new Date(),
            amount: 500,
            merchant: 'Merchant 1',
            userId: '1'
          }),
          Transaction.create({
            id: 2,
            date: new Date(),
            amount: 600,
            merchant: 'Merchant 2',
            userId: '1'
          }),
          Transaction.create({
            id: 3,
            date: new Date(),
            amount: 700,
            merchant: 'Merchant 3',
            userId: '2'
          }),
          Transaction.create({
            id: 4,
            date: new Date(),
            amount: 400,
            merchant: 'Merchant 4',
            userId: '1'
          }),
          Transaction.create({
            id: 5,
            date: new Date(),
            amount: 300,
            merchant: 'Merchant 5',
            userId: '2'
          }),
          Transaction.create({
            id: 6,
            date: new Date(),
            amount: 800,
            merchant: 'Merchant 6',
            userId: '1'
          }),
          Transaction.create({
            id: 7,
            date: new Date(),
            amount: 900,
            merchant: 'Merchant 7',
            userId: '2'
          }),
          Transaction.create({
            id: 8,
            date: new Date(),
            amount: 1000,
            merchant: 'Merchant 8',
            userId: '1'
          }),
          Transaction.create({
            id: 9,
            date: new Date(),
            amount: 1100,
            merchant: 'Merchant 9',
            userId: '2'
          }),
          Transaction.create({
            id: 10,
            date: new Date(),
            amount: 1200,
            merchant: 'Merchant 10',
            userId: '1'
          }),
          Transaction.create({
            id: 11,
            date: new Date(),
            amount: 1300,
            merchant: 'Merchant 11',
            userId: '2'
          }),
          Transaction.create({
            id: 12,
            date: new Date(),
            amount: 1400,
            merchant: 'Merchant 12',
            userId: '1'
          }),
          Transaction.create({
            id: 13,
            date: new Date(),
            amount: 1500,
            merchant: 'Merchant 8',
            userId: '2'
          }),
          Transaction.create({
            id: 14,
            date: new Date(),
            amount: 1600,
            merchant: 'Merchant 3',
            userId: '1'
          }),
          Transaction.create({
            id: 15,
            date: new Date(),
            amount: 200,
            merchant: 'Merchant 3',
            userId: '1'
          }),
          Transaction.create({
            id: 16,
            date: new Date(),
            amount: 200,
            merchant: 'Merchant 9',
            userId: '1'
          })
        ]);
      });
  });

  after(() => {
    return User.destroy({where: {}})
      .then(() => {
        return Transaction.destroy({where: {}});
      });
  });

  it('Should fail withouth token', () => {
    return request(application)
      .get('/api/transactions/top-merchants')
      .set('Accept', 'application/json')
      .expect(401)
      .then((response) => {
        response.body.code.should.be.equal('unauthorized');
      });
  });

  it('Should get top 10 merchants', () => {
    return request(application)
      .get('/api/transactions/top-merchants')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.should.be.an.Array();
        response.body.length.should.be.lessThanOrEqual(10);
        response.body[0].should.have.properties(['merchant', 'transactionCount']);
        response.body.should.containDeep([
          { merchant: 'Merchant 3', transactionCount: '3' },
          { merchant: 'Merchant 8', transactionCount: '2' },
          { merchant: 'Merchant 9', transactionCount: '2' },
          { merchant: 'Merchant 2', transactionCount: '1' },
          { merchant: 'Merchant 11', transactionCount: '1' },
          { merchant: 'Merchant 6', transactionCount: '1' },
          { merchant: 'Merchant 4', transactionCount: '1' },
          { merchant: 'Merchant 12', transactionCount: '1' },
          { merchant: 'Merchant 7', transactionCount: '1' },
          { merchant: 'Merchant 1', transactionCount: '1' }
        ]);
      });
  });
});
