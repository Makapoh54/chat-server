import express from 'express';
import { checkSchema } from 'express-validator/check';
import { usernameSchema } from '../validatons/UserSchema';
console.log(usernameSchema)
import { checkUserExists } from '../controllers/userController';

const router = express.Router();

router.get('/users/:username/exists', checkSchema(usernameSchema), checkUserExists);

export default router;
