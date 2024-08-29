import USUARIO from "../models/models.js";

export default class usuarioController {

    static async register(req, res) {
        try{

            const { Nombre, Correo, Contraseña, Nombre_Usuario } = req.body;
            USUARIO.register_bd( Nombre, Correo, Contraseña, Nombre_Usuario);
            res.status(200).json({ message: "Si funciona" });

        }catch(error){

            console.error(error);
            res.status(500).json({ error: "Error al registar" });

        }
        
    }

}