import { Router } from 'express'
import usuarioController from '../controllers/usuarioController.js';
import usuarioAccionesController from '../controllers/usuarioAccionesController.js'; 
const router = Router();

router.post('/REGISTER_USER', usuarioController.register);
router.post('/LOGIN_USER', usuarioController.login);
router.post('/BUSQUEDA-RESTAURANTE', usuarioAccionesController.buscarRestaurante);
router.get('/LISTAR-RESTAURANTE', usuarioAccionesController.listadoRestaurante);


export default router;