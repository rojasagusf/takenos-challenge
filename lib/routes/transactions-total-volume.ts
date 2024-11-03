import express from 'express';
import { getTotalVolume } from '../controllers/data-analysis';
import validateQueryFields from '../utils/middlewares/validate-query-fields';
import Joi from 'joi';

const router = express.Router();

router.get(
  '/transactions/total-volume',
  validateQueryFields(Joi.object({
    period: Joi.string().valid('day', 'week', 'month')
  })),
  getTotalVolume
);

export default router;
