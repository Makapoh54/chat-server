const logger = require('../utils/logger')('DefaultErrorHandler');

const defaultErrorHandler = (error, req, res, next) => {
  logger.log('error', `${error.name}:${error.status} - ${error.message}`);
  res.status(error.status || 500).send({ error: error.message });
};

export default defaultErrorHandler;
