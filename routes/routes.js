import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';
import usuarioAccionesController from '../controllers/usuarioAccionesController.js'; 
import { productController } from '../controllers/controllers.js';
const router = Router();

/**
 * @swagger
 * /REGISTER_USER:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - "Endpoints Usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Correo:
 *                 type: string
 *               Contraseña:
 *                 type: string
 *               Nombre_Usuario:
 *                 type: string
 *               TipoUsuario:
 *                 type: string
 *               Imagen:
 *                 type: string
 *               NIT:
 *                 type: string
 *               Direccion:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Hora_Apertura:
 *                 type: string
 *               Hora_Cierre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado con éxito
 */
router.post('/REGISTER_USER', usuarioController.register);

/**
 * @swagger
 * /LOGIN_USER:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags:
 *       - "Endpoints Usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo:
 *                 type: string
 *               Contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/LOGIN_USER', usuarioController.login);

/**
 * @swagger
 * /BUSQUEDA-RESTAURANTE:
 *   post:
 *     summary: Busca un restaurante
 *     tags:
 *       - "Endpoints Restaurante"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurante encontrado
 *       404:
 *         description: Restaurante no encontrado
 */
router.post('/BUSQUEDA-RESTAURANTE', usuarioAccionesController.buscarRestaurante);

/**
 * @swagger
 * /LISTAR-RESTAURANTE:
 *   get:
 *     summary: Lista todos los restaurantes
 *     tags:
 *       - "Endpoints Restaurante"
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 *       401:
 *         description: Error al listar restaurantes
 */
router.get('/LISTAR-RESTAURANTE', usuarioAccionesController.listadoRestaurante);

/**
 * @swagger
 * /OBTENER-INFORMACION:
 *   get:
 *     summary: Obtiene la información de un restaurante
 *     tags:
 *       - "Endpoints Restaurante"
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Token JWT de autenticación
 *     responses:
 *       200:
 *         description: Información del restaurante
 *       500:
 *         description: Error al conseguir la información del restaurante
 */
router.get('/OBTENER-INFORMACION', usuarioController.getInfoRestaurant);

/**
 * @swagger
 * /OBTENER_INFORMACION_USER:
 *   get:
 *     summary: Obtiene la información del usuario
 *     tags:
 *       - "Endpoints Usuario"
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Token JWT de autenticación
 *     responses:
 *       200:
 *         description: Información del usuario obtenida
 *       500:
 *         description: Error al obtener la información del usuario
 */
router.get('/OBTENER_INFORMACION_USER', usuarioController.getInfoUser);


/**
 * @swagger
 * /OBTENER_TOP_5_H:
 *   get:
 *     summary: Obtiene el top 5 de hamburguesas
 *     tags:
 *       - "Endpoints Restaurante"
 *     responses:
 *       200:
 *         description: Top 5 de hamburguesas obtenido
 *       500:
 *         description: Error al conseguir la información
 */
router.get('/OBTENER_TOP_5_H', usuarioController.getBestFiveH);

/**
 * @swagger
 * /OBTENER_TOP_5_R:
 *   get:
 *     summary: Obtiene el top 5 de restaurantes
 *     tags:
 *       - "Endpoints Restaurante"
 *     responses:
 *       200:
 *         description: Top 5 de restaurantes obtenido
 *       500:
 *         description: Error al conseguir la información
 */
router.get('/OBTENER_TOP_5_R', usuarioController.getBestFiveR);

/**
 * @swagger
 * /GET_BURGERS_RESTAURANT:
 *   get:
 *     summary: Obtiene las hamburguesas de un restaurante por su NIT
 *     tags:
 *       - "Endpoints Restaurante"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NIT:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lista de hamburguesas del restaurante obtenida
 *       500:
 *         description: Error al conseguir las hamburguesas del restaurante
 */
router.get('/GET_BURGERS_RESTAURANT', usuarioController.getBurgersRestaurant);

/**
 * @swagger
 * /FAVORITOS_HAMBURGUESA:
 *   post:
 *     summary: Agrega o elimina una hamburguesa de favoritos
 *     tags:
 *       - "Endpoints Usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idHamburguesa:
 *                 type: string
 *               fav:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Favoritos de hamburguesa actualizado
 *       500:
 *         description: Error al actualizar los favoritos de hamburguesa
 */
router.post('/FAVORITOS_HAMBURGUESA', usuarioController.FavHamburguesa);

/**
 * @swagger
 * /FAVORITOS_RESTAURANTE:
 *   post:
 *     summary: Agrega o elimina un restaurante de favoritos
 *     tags:
 *       - "Endpoints Usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NIT:
 *                 type: string
 *               fav:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Favoritos de restaurante actualizado
 *       500:
 *         description: Error al actualizar los favoritos de restaurante
 */
router.post('/FAVORITOS_RESTAURANTE', usuarioController.FavRestaurante);

/**
 * @swagger
 * /obtener_comentarios:
 *   post:
 *     summary: Obtiene los comentarios de una hamburguesa
 *     tags:
 *       - "Endpoints Restaurante"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idHamburguesa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentarios obtenidos
 *       500:
 *         description: Error al obtener los comentarios
 */
router.post('/obtener_comentarios', usuarioAccionesController.obtenerComentarios);

/**
 * @swagger
 * /comentar_hamburguesa:
 *   post:
 *     summary: Comenta sobre una hamburguesa
 *     tags:
 *       - "Endpoints Usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *               Calificacion:
 *                 type: number
 *               Imagen:
 *                 type: string
 *               idLugar:
 *                 type: string
 *               idHamburguesa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario realizado
 *       500:
 *         description: Error al realizar el comentario
 */
router.post('/comentar_hamburguesa', usuarioAccionesController.comentarHambuguesa)

/**
 * @swagger
 * /add_hamburguesa:
 *   post:
 *     summary: Crea una nueva hamburguesa
 *     tags:
 *       - "Endpoints Restaurante"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Descripcion:
 *                 type: string
 *               Imagen:
 *                 type: string
 *               Precio:
 *                 type: number
 *               Restaurante_NIT:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hamburguesa creada correctamente
 *       500:
 *         description: Error al crear la hamburguesa
 */
router.post('/add_hamburguesa', productController.createProducts);

/**
 * @swagger
 * /hamburguesas:
 *   post:
 *     summary: Lee las hamburguesas de un restaurante
 *     tags:
 *       - "Endpoints Restaurante"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hamburguesas obtenidas correctamente
 *       500:
 *         description: Error al obtener las hamburguesas
 */
router.post('/hamburguesas', productController.readProducts);

/**
 * @swagger
 * /delete_hamburguesa:
 *   post:
 *     summary: Elimina una hamburguesa
 *     tags:
 *       - "Endpoints Restaurante"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hamburguesa eliminada
 *       500:
 *         description: Error al eliminar la hamburguesa
 */
router.post('/delete_hamburguesa', productController.deleteProducts);

/**
 * @swagger
 * /search_hamburguesa:
 *   post:
 *     summary: Busca una hamburguesa por texto
 *     tags:
 *       - "Endpoints Usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               nit:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hamburguesa encontrada
 *       404:
 *         description: Hamburguesa no encontrada
 *       500:
 *         description: Error al buscar la hamburguesa
 */
router.post('/search_hamburguesa', productController.searchProduct)
export default router;