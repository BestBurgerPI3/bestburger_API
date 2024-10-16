import MODEL from "../models/models.js";

export default class usuarioAccionesController {

    static async buscarRestaurante(req, res) {

        try {

            const { Nombre } = req.body;
            const restaurante = await MODEL.busquedaRestaurante_bd(Nombre);

            if (restaurante.length === 0) {
                return res.status(404).json({ error: "No se encontró ningún restaurante con ese nombre" });
            }

            console.log('Restaurantes encontrados:', restaurante);
            res.status(200).json(restaurante);

        } catch (error) {
            console.log('Error al buscar restaurante');
            res.status(401).json({ error: "Error al buscar restaurante" });
        }

    }
    static async listadoRestaurante(req, res){
        try {
            const restaurantes = await MODEL.listarRestaurante_bd();
            console.log(restaurantes);

            res.status(200).json(restaurantes);

        } catch (error) {
            console.log('Error al listar los restaurante');
            res.status(401).json({ error: "Error al listar los restaurante" });
        }
    }
    static async comentarHambuguesa(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const decoded = jwt.decode(token);
            const { Correo } = decoded;
            console.log('Correo del usuario: ' + Correo);
            
            const { Descripcion, Calificacion, Imagen, idLugar, idHamburguesa, nit } = await req.body;

            const response = await MODEL.comentarHamburguesa( Descripcion, Calificacion, Imagen ,idLugar, idHamburguesa, nit, Correo);
            
            if (!response) {
                return res.status(404).json({ error: "No se encontró la hamburguesa" });
            }
            console.log('Comentario realizado:', response);
            res.status(200).json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al comentar la hamburguesa" });
        }
    }

    static async obtenerComentarios(req, res) {
        try {
            const { idHamburguesa } = req.body;
            const comentarios = await MODEL.obtenerComentarios(idHamburguesa);
            console.log('Comentarios:', comentarios);
            res.status(200).json(comentarios);

        } 
        catch (error) {
            console.log('Error al obtener los comentarios');
            res.status(401).json({ error: "Error al obtener los comentarios" });
        }
    }
    static async orderByCalificacion(req, res) {
        try {
            const hamburguesas = await MODEL.hamburguesasTop();
            console.log('Comentarios ordenados por calificación:', comentarios);
            res.status(200).json(hamburguesas);
        } catch (error) {
            console.log('Error al ordenar los comentarios por calificación');
            res.status(401).json({ error: "Error al ordenar los comentarios por calificación" });
    
        }
    }

}