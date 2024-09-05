

import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';
import usuarioAccionesController from '../controllers/usuarioAccionesController.js'; 
import { productController } from '../controllers/controllers.js';
const router = Router();


router.post('/REGISTER_USER', usuarioController.register);
router.post('/LOGIN_USER', usuarioController.login);
router.post('/BUSQUEDA-RESTAURANTE', usuarioAccionesController.buscarRestaurante);
router.get('/LISTAR-RESTAURANTE', usuarioAccionesController.listadoRestaurante);
router.get('/OBTENER-INFORMACION', usuarioController.getInfoRestaurant);

router.post('/hamburguesas', productController.readProducts);
router.post('/delete_hamburguesa', productController.deleteProducts);
export default router;