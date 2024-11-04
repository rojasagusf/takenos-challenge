import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import Transaction from '../../lib/models/transaction.model';
import User from '../../lib/models/user.model';

describe('POST /api/transactions/fraudulent', () => {
  let application: Application;

  before(function () {
    application = start();
    const now = new Date();
    return Promise.all([
      User.create({
        id: 1,
        email: 'test@example.com',
        password: 'testing'
      }),
      User.create({
        id: 2,
        email: 'test2@example.com',
        password: 'testing2'
      })
    ])
      .then(() => {
        return Promise.all([
          Transaction.create({
            transaction_id: 1,
            date: now,
            amount: 500,
            merchant: 'Merchant 1',
            userId: '1'
          }),
          Transaction.create({
            transaction_id: 2,
            date: now,
            amount: 600,
            merchant: 'Merchant 2',
            userId: '2'
          }),
          Transaction.create({
            transaction_id: 5,
            date: now,
            amount: 100001,
            merchant: 'HighValue Merchant',
            userId: '2'
          }),
          Transaction.create({
            transaction_id: 16,
            date: now,
            amount: 200100,
            merchant: 'HighValue Merchant2',
            userId: '2'
          }),
          Transaction.create({
            transaction_id: 6,
            date: now,
            amount: 300,
            merchant: 'Rapid Merchant',
            userId: '1'
          }),
          Transaction.create({
            transaction_id: 7,
            date: now,
            amount: 350,
            merchant: 'Rapid Merchant',
            userId: '1'
          }),

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
      .get('/api/transactions/fraudulent')
      .set('Accept', 'application/json')
      .expect(401)
      .then((response) => {
        response.body.code.should.be.equal('unauthorized');
      });
  });

  it('Should get all possible fraudulent transactions', () => {
    return request(application)
      .get('/api/transactions/fraudulent')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.highValueTransactions.should.have.lengthOf(2);
        response.body.highValueTransactions.should.containDeep([
          {
            transaction_id: 5,
            amount: 100001,
            merchant: 'HighValue Merchant',
            userId: 2
          },
          {
            transaction_id: 16,
            amount: 200100,
            merchant: 'HighValue Merchant2',
            userId: 2
          }
        ]);
      });
  });
});
