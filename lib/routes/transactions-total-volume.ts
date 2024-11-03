import express from 'express';
import { getTotalVolume } from '../controllers/data-analysis';

const router = express.Router();

router.get(
  '/transactions/total-volume',
  getTotalVolume
);

export default router;
