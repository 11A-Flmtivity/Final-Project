import { Router } from 'express';
import { getLoginPage, getRegisterPage, postLogin, postRegister, logout } from '../controllers/authController.js';

const router = Router();

router.get('/login', getLoginPage);
router.post('/login', postLogin);

router.get('/register', getRegisterPage);
router.post('/register', postRegister);

router.get('/logout', logout);

export default router;