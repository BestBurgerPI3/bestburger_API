import { pool } from "./db.js";

export default class USUARIO {

    static async register_bd(Nombre, Correo, Contraseña, Nombre_Usuario) {
        try {
            //Revisar si el usuario ya esta registrado
            const exist = await pool.query(
                'SELECT COUNT(*) AS count FROM usuario WHERE Correo = ?',
                [Correo]
            );

            if(exist[0].count > 0){
                return 'Ya existe el usuario';
            }else{

                const insert = `
                    INSERT INTO usuario (idUsuario, Nombre, Correo, Contraseña, Nombre_Usuario) 
                    VALUES (?, ?, ?, ?, ?);
                `;
                const result = await pool.query(insertQuery, [Nombre, Correo, Contraseña, Nombre_Usuario]);
                return result;
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al registar en la BD" });
        }
    }

}