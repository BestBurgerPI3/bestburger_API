import { Router } from 'express';
import { productController } from '../controllers/controllers';
const router = Router();


router.get('/restaurantes', productController.getAllProducts);

export default router;