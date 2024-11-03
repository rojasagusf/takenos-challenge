import 'mocha';
import 'should';
import { start } from '../mocks/app';
import request from 'supertest';
import { Application } from 'express';
import Transaction from '../../lib/models/transaction.model';
import User from '../../lib/models/user.model';

describe('POST /api/transactions/total-volume', () => {
  let application: Application;

  before(function () {
    application = start();
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    const lastMonth = new Date(now);
    lastMonth.setDate(now.getDate() - 20);
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
            id: 1,
            date: now,
            amount: 500,
            merchant: 'Merchant 1',
            userId: '1'
          }),
          Transaction.create({
            id: 2,
            date: now,
            amount: 600,
            merchant: 'Merchant 2',
            userId: '1'
          }),
          Transaction.create({
            id: 3,
            date: yesterday,
            amount: 700,
            merchant: 'Merchant 3',
            userId: '2'
          }),

          Transaction.create({
            id: 4,
            date: lastWeek,
            amount: 400,
            merchant: 'Merchant 4',
            userId: '1'
          }),
          Transaction.create({
            id: 5,
            date: lastWeek,
            amount: 300,
            merchant: 'Merchant 5',
            userId: '2'
          }),


          Transaction.create({
            id: 6,
            date: lastMonth,
            amount: 800,
            merchant: 'Merchant 6',
            userId: '1'
          }),
          Transaction.create({
            id: 7,
            date: lastMonth,
            amount: 900,
            merchant: 'Merchant 7',
            userId: '2'
          }),
          Transaction.create({
            id: 8,
            date: lastMonth,
            amount: 1000,
            merchant: 'Merchant 8',
            userId: '1'
          }),
          Transaction.create({
            id: 9,
            date: lastMonth,
            amount: 1100,
            merchant: 'Merchant 9',
            userId: '2'
          }),
          Transaction.create({
            id: 10,
            date: lastMonth,
            amount: 1200,
            merchant: 'Merchant 10',
            userId: '1'
          }),
          Transaction.create({
            id: 11,
            date: lastMonth,
            amount: 1300,
            merchant: 'Merchant 11',
            userId: '2'
          }),
          Transaction.create({
            id: 12,
            date: lastMonth,
            amount: 1400,
            merchant: 'Merchant 12',
            userId: '1'
          }),
          Transaction.create({
            id: 13,
            date: lastMonth,
            amount: 1500,
            merchant: 'Merchant 8',
            userId: '2'
          }),
          Transaction.create({
            id: 14,
            date: lastMonth,
            amount: 1600,
            merchant: 'Merchant 3',
            userId: '1'
          }),
          Transaction.create({
            id: 15,
            date: lastMonth,
            amount: 200,
            merchant: 'Merchant 3',
            userId: '1'
          }),
          Transaction.create({
            id: 16,
            date: lastMonth,
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
      .get('/api/transactions/total-volume')
      .set('Accept', 'application/json')
      .expect(401)
      .then((response) => {
        response.body.code.should.be.equal('unauthorized');
      });
  });

  it('Should fail with invalid period', () => {
    return request(application)
      .get('/api/transactions/total-volume')
      .query({
        period: 'year'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(400)
      .then((response) => {
        response.body.code.should.be.equal('invalid_fields');
      });
  });

  it('Should get total volume for the last day', () => {
    return request(application)
      .get('/api/transactions/total-volume')
      .query({
        period: 'day'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.transactionCount.should.be.equal(3);
      });
  });

  it('Should get total volume for the last week', () => {
    return request(application)
      .get('/api/transactions/total-volume')
      .query({
        period: 'week'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.transactionCount.should.be.equal(5);
      });
  });

  it('Should get total volume for the last moth', () => {
    return request(application)
      .get('/api/transactions/total-volume')
      .query({
        period: 'month'
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.transactionCount.should.be.equal(16);
      });
  });

  it('Should get total volume for all periods', () => {
    return request(application)
      .get('/api/transactions/total-volume')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer token_user_0001')
      .expect(200)
      .then((response) => {
        response.body.should.have.properties(['dayVolume', 'weekVolume', 'monthVolume']);
        response.body.should.containDeep({
          dayVolume: 3,
          weekVolume: 5,
          monthVolume: 16
        });
      });
  });
});
