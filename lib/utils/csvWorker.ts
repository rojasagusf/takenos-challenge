import { parentPort } from 'worker_threads';
import { parse } from 'csv-parse/sync';
import Transaction from '../models/transaction.model';
import { sequelize } from '../models';

sequelize.addModels([Transaction]);

parentPort?.on('message', (data: string) => {
  console.log('Processing CSV File');

  const records = parse(data, {
    columns: true,
    skip_empty_lines: true
  });

  const processedRecords = records.map(record => {
    return {
      ...record,
      amount: parseFloat(record.amount)
    };
  });

  const savePromises = processedRecords.map(record => {
    return Transaction.create(record)
      .catch(err => {
        console.error(`Error saving record: ${JSON.stringify(record)}`, err);
        throw err;
      });
  });

  Promise.all(savePromises)
    .then(() => {
      parentPort?.postMessage('Process complete');
    });
});
