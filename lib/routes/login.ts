import express from 'express';
import { loginUser } from '../controllers/authController';
import validateBodyFields from '../utils/middlewares/validate-body-fields';
import Joi from 'joi';

const router = express.Router();

router.post(
  '/login',
  validateBodyFields(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(14).required()
  })),
  loginUser
);

export default router;
