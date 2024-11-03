import { Op } from 'sequelize';
import Transaction from '../models/transaction.model';

export default async function countTransactions(startDate: Date, endDate: Date) {
  const count = await Transaction.count({
    where: {
      date: {
        [Op.between]: [startDate, endDate],
      },
    },
  });

  return count;
};
