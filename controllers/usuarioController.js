import MODEL from "../models/models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";


export default class usuarioController {

    static async login(req, res) {
        try {
            const { Correo, Contraseña } = req.body;

            const userCheck = await MODEL.getCorreo(Correo);

            if (userCheck.exists) {
                const [User_DB] = await MODEL.getUser(Correo);
                const match = await bcrypt.compare(Contraseña, User_DB.Contraseña);

                if (match) {
                    console.log('Inicio de sesión correctamente');
                    const tipoUsuario = userCheck.TipoUsuario_idTipoUsuario;
                    const nombre = userCheck.Nombre;

                    if (JWT_SECRET !== '') {
                        const token = jwt.sign({ Correo, tipoUsuario, nombre }, JWT_SECRET, {
                            expiresIn: '1h',
                        });
                        console.log(`Token de inicio de sesión: ${token}`);
                        res.status(200).json({ token });
                    } else {
                        res.status(500).json({ error: "No JWT_SECRET en ENV" });
                    }
                } else {
                    res.status(401).json({ error: "Credenciales incorrectas" });
                }
            } else {
                res.status(401).json({ error: "Credenciales incorrectas" });
            }

        } catch (error) {
            console.error("Error durante el login:", error);
            res.status(500).json({ error: "Ha ocurrido un error en el login" });
        }
    }

    static async register(req, res) {
        try {

            const { Nombre, Correo, Contraseña, Nombre_Usuario, TipoUsuario, Imagen, NIT, Direccion, Telefono, Hora_Apertura, Hora_Cierre } = req.body;
            const hash = await bcrypt.hash(Contraseña, 12);

            const registro = await MODEL.registerUser_bd(Nombre, Correo, hash, Nombre_Usuario, TipoUsuario, Imagen, NIT, Direccion, Telefono, Hora_Apertura, Hora_Cierre);
            console.log(registro);

            res.status(200).json({ registro });

        } catch (error) {

            console.error(error);
            res.status(500).json({ error: "Error al registar" });

        }

    }

    static async getInfoRestaurant(req, res) {

        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token:' + token);

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                const { nombre } = decoded;
                console.log('Nombre: ' + nombre);

                const info = await MODEL.getInfoRestaurant_bd(nombre);
                console.log('Info: ', JSON.stringify(info, null, 2));

                res.status(200).json({ info });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Error al conseguir la informacion del restaurante" });
            }
        }
    }


}
