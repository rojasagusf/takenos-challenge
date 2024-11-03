import express from 'express';
import { validateUserExists } from '../utils/middlewares/validate-user-exists';
import { registerUser } from '../controllers/authController';
import Joi from 'joi';
import validateBodyFields from '../utils/middlewares/validate-body-fields';

const router = express.Router();

router.post(
  '/register',
  validateBodyFields(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(14).required()
  })),
  validateUserExists,
  registerUser
);

export default router;
