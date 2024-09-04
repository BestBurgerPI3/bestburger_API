import { pool } from "./db.js";

export default class MODEL {

    static async getUser(Correo) {
        try {

            const exist = await pool.query(
                'SELECT * FROM Usuario WHERE Correo = ?',
                [Correo]
            );

            if (exist) {
                const [hash] = await pool.query('SELECT Contraseña FROM Usuario WHERE Correo = ?', Correo);
                return [hash];
            }

            return 'Usuario no registrado';


        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al consultar en la BD" });
        }
    }
    static async getCorreo(Correo) {
        try {

            const exist = await pool.query(
                'SELECT * FROM Usuario WHERE Correo = ?',
                [Correo]
            );

            if (exist) {
                return true;
            }else{
                return false;
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al consultar en la BD" });
        }
    }
    static async registerUser_bd(Nombre, Correo, hash, Nombre_Usuario, TipoUsuario, Imagen, NIT, Direccion, Telefono, Hora_Apertura, Hora_Cierre) {
        try {
            // Revisar si el usuario ya está registrado
            const rows = await pool.query(
                'SELECT COUNT(*) AS count FROM Usuario WHERE Correo = ?',
                [Correo]
            );
            const exist = rows[0];

            if (exist.count > 0) {
                return 'Ya existe el usuario';
            } else {
                // Insertar el nuevo usuario
                const insertUsuario = `
                    INSERT INTO Usuario (Nombre, Correo, Contraseña, Nombre_Usuario, TipoUsuario_idTipoUsuario, Foto_Perfil_idFoto_Perfil) 
                    VALUES (?, ?, ?, ?, ?, ?);
                `;
                const result = await pool.query(insertUsuario, [Nombre, Correo, hash, Nombre_Usuario, TipoUsuario, Imagen]);

                if (TipoUsuario === '2') {
                    // Insertar el restaurante si el usuario es de tipo 2
                    const insertRestaurante = `
                        INSERT INTO Restaurante (NIT, Nombre, Direccion, Telefono, Hora_Apertura, Hora_Cierre, Calificacion, Imagen) 
                        VALUES (?, ?, ?, ?, ?, ?, 0, ?);
                    `;
                    const result2 = await pool.query(insertRestaurante, [NIT, Nombre, Direccion, Telefono, Hora_Apertura, Hora_Cierre, Imagen]);
                    return 'Restaurante registrados';
                }

                return 'Usuario Registrado';
            }

        } catch (error) {
            console.error(error);
            throw new Error("Error al registrar en la base de datos");
        }
    }
    static async busquedaRestaurante_bd(Nombre) {
        try {
            const busqueda = `%${Nombre}%`;

            const [restaurantes] = await pool.query(
                'SELECT * FROM Restaurante WHERE Nombre LIKE ?',
                [busqueda]
            );
    
            return restaurantes || [];
    
        } catch (error) {
            console.error('Error al buscar restaurante en la BD:', error);
            throw new Error('Error al buscar restaurante en la BD');
        }
    }
    static async listarRestaurante_bd(){
        try {

            const [restaurantes] = await pool.query(
                'SELECT * FROM Restaurante'
            );

            if(restaurantes){
                return restaurantes;
            }else{
                return 'no hay restaurantes registrados';
            }

        } catch (error) {
            console.error('Error al listar restaurantes de la BD:', error);
            throw new Error('Error al listar restaurantes de la BD');
        }
    }

}
