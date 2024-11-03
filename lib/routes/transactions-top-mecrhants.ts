import express from 'express';
import Transaction from '../models/transaction.model';
import { sequelize } from '../models';
import logger from '../logger';

const router = express.Router();

async function getTopMerchants(_req, res) {
  try {
    const topMerchants = await Transaction.findAll({
      attributes:[
        'merchant',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
      ],
      group: ['merchant'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      limit: 10,
    });

    return res.status(200).json(topMerchants);
  } catch (error) {
    logger.error(`getTopMerchants error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
}

router.get(
  '/transactions/top-merchants',
  getTopMerchants
);

export default router;
