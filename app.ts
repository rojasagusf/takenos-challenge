
import express, { Response, Application } from 'express';
const app: Application = express();
import cors from 'cors';
import path from 'path';
import  expressWinston  from 'express-winston';
import logger from './lib/logger';
import publicPaths from './config/public-paths';
import { extractJwt } from './lib/utils/jwt-utils';

const initialize = () => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(expressWinston.logger({
    winstonInstance: logger,
    expressFormat: true,
    colorize: false,
    meta: false,
    statusLevels: true
  }));

  app.get(publicPaths('get'), extractJwt);
  app.patch(publicPaths('patch'), extractJwt);
  app.post(publicPaths('post'), extractJwt);
  app.delete(publicPaths('delete'), extractJwt);

  app.use(function (_req, _res, next) {
    const err = { message: 'Not Found', status: 404, stack: {}, };
    next(err);
  });

  app.use((res: Response) => {
    console.error('Not Found');
    res.status(400).json({
      status: 'not_found',
      message: 'Not Found'
    });

    return;
  });

  return app;
};

export default initialize;
