import express from 'express';
import { getFraudulentTransactions } from '../controllers/data-analysis';

const router = express.Router();

router.get(
  '/transactions/fraudulent',
  getFraudulentTransactions
);

export default router;
