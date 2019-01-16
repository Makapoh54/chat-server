import { validationResult } from 'express-validator/check';
import AppError from '../errors/AppError';
import userStorage from '../storage/userStorage';

const logger = require('../utils/logger')('UserController');

const checkUserExists = async (req, res, next) => {
  logger.log('info', `checkUserExists: ${JSON.stringify(req.params)}`);
  try {
    validationResult(req).throw();
    res.status(200).send({ data: { userExists: userStorage.isUserExist(req.params.username) } });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

export { checkUserExists };
