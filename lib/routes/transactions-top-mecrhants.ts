import express from 'express';
import { getTopMerchants } from '../controllers/data-analysis';

const router = express.Router();

router.get(
  '/transactions/top-merchants',
  getTopMerchants
);

export default router;
