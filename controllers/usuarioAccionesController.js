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

}