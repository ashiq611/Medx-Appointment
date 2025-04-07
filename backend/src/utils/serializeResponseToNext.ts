import { NextFunction, Response } from 'express';

export const serializeResponseToNext = (
  res: Response,
  data: unknown,
  next: NextFunction,
  messageCode = ''
) => {
  return new Promise<void>((resolve, reject) => {
    res.json({
      data,
      messageCode,
    });
    res.on('finish', () => {
      resolve();
    });

    res.on('error', (error) => {
      reject(error);
      next(error);
    });
  });
};

export const ADD_SUCCESS = '';
export const UPDATE_SUCCESS = '';
export const SUCCESS = 'SUCCESS';
