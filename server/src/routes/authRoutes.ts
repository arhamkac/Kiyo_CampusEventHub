import { Router } from 'express';
import { register, login, firebaseLogin } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/firebase', firebaseLogin);

export default router;
