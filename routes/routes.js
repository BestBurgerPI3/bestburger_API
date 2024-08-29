import { Router } from 'express'
import usuarioController from '../controllers/usuarioController.js';
const router = Router();

router.post('/REGISTER_USUARIO', usuarioController.register);

export default router;