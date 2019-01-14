import express from 'express';

import { checkUserExists, addNewUser } from '../controllers/userController';

const router = express.Router();

router.post('/users', addNewUser);
router.get('/users/:username/exists', checkUserExists);

export default router;
