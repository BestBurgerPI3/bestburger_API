import { Router } from 'express';
import { productController } from '../controllers/controllers.js';
const router = Router();


router.post('/hamburguesas', productController.getProducts);

export default router;