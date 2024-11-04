import express from 'express';
import multer from 'multer';
import validateBodyFields from '../utils/middlewares/validate-body-fields';
import Joi from 'joi';
import { Worker } from 'worker_threads';
import path from 'path';
import sendEmailTemplate from '../utils/mail-templates';

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});

function addToprocess(req, res) {
  const workerPath = path.join(__dirname, '../utils/csvWorker.js');

  const worker = new Worker(workerPath);
  worker.postMessage(req.file.buffer.toString('utf-8'));


  res.status(202).json('File successfully uploaded');

  worker.on('message', (message) => {
    console.log(message);

    if (message === 'Process complete'){
      return sendEmailTemplate(
        'success-csv',
        req.user.name,
        'Success processing CSV'
      );
    }
    return;
  });

  worker.on('error', (error) => {
    console.error(`Error en el worker: ${error.message}`);

    return sendEmailTemplate(
      'error-csv',
      req.user.name,
      'Error processing CSV'
    );
  });

}

router.post(
  '/upload',
  upload.single('file'),
  validateBodyFields(Joi.object({
    mimetype: Joi.string().valid('text/csv', 'application/csv').required(),
    size: Joi.number().max(5 * 1024 * 1024).required(),
    fieldname: Joi.string().optional(),
    originalname:  Joi.string().optional(),
    encoding:  Joi.string().optional(),
    destination:  Joi.string().optional(),
    filename: Joi.string().optional(),
    path:  Joi.string().optional(),
    buffer: Joi.optional(),
  }).required()),
  addToprocess
);

export default router;
