import express from 'express';
import { registerUser, loginUser, updateUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/authentication';
import { validateBody } from '../validators/validateBody';
import { registerUserSchema, updateUserSchema } from '../validators/userValidation';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), registerUser);
router.post('/login', authenticate, validateBody, loginUser)
router.put('/profile', authenticate, validateBody(updateUserSchema), updateUser);

export default router;

