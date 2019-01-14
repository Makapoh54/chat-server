import userStorage from '../storage/userStorage';

const logger = require('../utils/logger')('UserController');

const checkUserExists = async (req, res) => {
  logger.log('info', JSON.stringify(req.query));
  res.status(200).send({ data: { userExists: userStorage.isUserExist(req.query.username) } });
};

const addNewUser = async (req, res) => {
  const userExists = userStorage.isUserExist(req.params.username);
  if (!userExists) {
    userStorage.addUser(req.body.username);
    res.status(200).send({ message: 'User Added, can connect', data: { userAdded: true } });
  } else {
    res
      .status(200)
      .send({ message: 'User already exists, cannot connect', data: { userAdded: false } });
  }
};

export { checkUserExists, addNewUser };
