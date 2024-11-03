import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import logger from '../logger';
import { createToken } from '../utils/jwt-utils';
import User from '../models/user.model';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const formattedData = {
      email,
      password: await bcryptjs.hash(password, 10),
    };

    const user = await User.create(formattedData);

    if (!user) {
      throw new Error('Error creating user');
    }

    return res.status(201).json(user);
  } catch (error) {
    logger.error(`registerUser error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(400).json({
        code: 'user_not_exists',
        message: 'User not exists'
      });
    }

    const samePassword = await bcryptjs.compare(password, user.password);

    if (!samePassword) {
      return res.status(400).json({
        code: 'invalid_authentication',
        message: 'Invalid authentication'
      });
    }

    const token = createToken(user.id, user.email);

    res.cookie('token', token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
    return res.status(200).json({
      token,
      user
    });
  } catch (error) {
    logger.error(`loginUser error: ${(error as Error).message}`);
    return res.status(500).json({
      code: 'internal_error',
      message: 'Internal error'
    });
  }
};
