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
router.get('/OBTENER_INFORMACION_USER', usuarioController.getInfoUser);

router.get('/OBTENER_TOP_5_H', usuarioController.getBestFiveH);
router.get('/OBTENER_TOP_5_R', usuarioController.getBestFiveR);
router.get('/GET_BURGERS_RESTAURANT', usuarioController.getBurgersRestaurant);
router.post('/FAVORITOS_HAMBURGUESA', usuarioController.FavHamburguesa);
router.post('/FAVORITOS_RESTAURANTE', usuarioController.FavRestaurante);



//falta por hacer
// router.get('/OBTENER_TOP_10_R', usuarioController); //Peores, Favoritos, Mejores
// router.post('/AGREGAR_CANTIDAD_HAMBURGUESA', usuarioController);



router.post('/obtener_comentarios', usuarioAccionesController.obtenerComentarios);


router.post('/comentar_hamburguesa', usuarioAccionesController.comentarHambuguesa)
router.post('/add_hamburguesa', productController.createProducts);
router.post('/hamburguesas', productController.readProducts);
router.post('/delete_hamburguesa', productController.deleteProducts);
router.post('/search_hamburguesa', productController.searchProduct)
export default router;