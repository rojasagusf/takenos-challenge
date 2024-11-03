import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';
import { sequelize } from '../models';
import logger from '../logger';
import countTransactions from '../utils/transaction-helper';
const VALID_QUERY_PERIODS = ['day', 'week', 'month'];

export async function getTopMerchants(_req: Request, res: Response) {
  try {
    const topMerchants = await Transaction.findAll({
      attributes:[
        'merchant',
        [sequelize.fn('COUNT', sequelize.col('id')), 'transactionCount'],
      ],
      group: ['merchant'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
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

export async function getTotalVolume(req: Request, res: Response) {
  const { period } = req.query;
  const endDate = new Date();
  let startDate: Date;
  let transactionCount: number;

  try {
    if (!VALID_QUERY_PERIODS.includes(period as string)) {
      const dayVolume = await countTransactions(new Date(endDate.setDate(endDate.getDate() - 1)), new Date());
      const weekVolume = await countTransactions(new Date(endDate.setDate(endDate.getDate() - 7)), new Date());
      const monthVolume = await countTransactions(new Date(endDate.setMonth(endDate.getMonth() - 1)), new Date());

      return res.status(200).json({
        dayVolume,
        weekVolume,
        monthVolume,
      });
    }

    switch (period) {
    case 'day':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 1);
      transactionCount = await countTransactions(startDate, endDate);
      return res.status(200).json({ transactionCount });
    case 'week':
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      transactionCount = await countTransactions(startDate, endDate);
      return res.status(200).json({ transactionCount });
    case 'month':
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 1);
      transactionCount = await countTransactions(startDate, endDate);
      return res.status(200).json({ transactionCount });
    default:
      return res.status(400).json({
        code: 'invalid_period',
        message: 'Invalid period'
      });
    }
  } catch(error) {
    logger.error(`getTopMerchants error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
}
