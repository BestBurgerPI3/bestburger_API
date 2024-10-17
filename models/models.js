import { pool } from './db.js';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

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
            res.status(500).json({ error: 'Error al consultar en la BD' });
        }
    }
    static async getCorreo(Correo) {
        try {

            const [rows] = await pool.query(
                'SELECT * FROM Usuario WHERE Correo = ?',
                [Correo]
            );

            if (rows) {
                return {
                    exists: true,
                    TipoUsuario_idTipoUsuario: rows.TipoUsuario_idTipoUsuario,
                    Nombre: rows.Nombre,
                };
            } else {
                return { exists: false };
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al consultar en la BD' });
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
            }

            const usernameRows = await pool.query(
                'SELECT COUNT(*) AS count FROM Usuario WHERE Nombre_Usuario = ?',
                [Nombre_Usuario]
            );

            const usernameExist = usernameRows[0].count;

            if (usernameExist > 0) {
                return 'El nombre de usuario ya está en uso';
            }

            // Insertar el nuevo usuario
            const insertUsuario = `
            INSERT INTO Usuario (Nombre, Correo, Contraseña, Nombre_Usuario, TipoUsuario_idTipoUsuario, Foto_Perfil_idFoto_Perfil) 
            VALUES (?, ?, ?, ?, ?, ?);
            `;
            const result = await pool.query(insertUsuario, [Nombre, Correo, hash, Nombre_Usuario, TipoUsuario, Imagen]);

            if (TipoUsuario === 2) {

                const restaurantNameRows = await pool.query(
                    'SELECT COUNT(*) AS count FROM Restaurante WHERE Nombre = ?',
                    [Nombre]
                );
                const restaurantNameExist = restaurantNameRows[0].count;

                if (restaurantNameExist > 0) {
                    return 'El nombre del restaurante ya está en uso';
                }

                // Insertar el restaurante si el usuario es de tipo 2

                const insertRestaurante = `
                        INSERT INTO Restaurante (NIT, Nombre, Direccion, Telefono, Hora_Apertura, Hora_Cierre, Calificacion, Imagen) 
                        VALUES (?, ?, ?, ?, ?, ?, 0, ?);
                    `;
                const result2 = await pool.query(insertRestaurante, [NIT, Nombre, Direccion, Telefono, Hora_Apertura, Hora_Cierre, Imagen]);

                return 'Restaurante registrados';
            }

            return 'Usuario Registrado';

        } catch (error) {
            console.error(error);
            throw new Error('Error al registrar en la base de datos');
        }
    }
    static async busquedaRestaurante_bd(Nombre) {
        try {
            const busqueda = `%${Nombre}%`;

            const restaurantes = await pool.query(
                'SELECT * FROM Restaurante WHERE Nombre LIKE ?',
                [busqueda]
            );

            return restaurantes || [];

        } catch (error) {
            console.error('Error al buscar restaurante en la BD:', error);
            throw new Error('Error al buscar restaurante en la BD');
        }
    }
    static async listarRestaurante_bd() {
        try {

            const restaurantes = await pool.query(
                'SELECT * FROM Restaurante'
            );

            if (restaurantes) {
                return restaurantes;
            } else {
                return 'no hay restaurantes registrados';
            }

        } catch (error) {
            console.error('Error al listar restaurantes de la BD:', error);
            throw new Error('Error al listar restaurantes de la BD');
        }
    }
    static async getInfoRestaurant_bd(nombre) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM Restaurante WHERE Nombre = ?',
                [nombre]
            );

            if (rows) {
                return rows;
            } else {
                console.log('No se encontró el restaurante');
                return null;
            }

        } catch (error) {
            console.error(error);
            throw new Error("Error al consultar en la BD");
        }
    }
    static async getInfoUser_db(correo) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM Usuario WHERE Correo = ?',
                [correo]
            );

            const idUser = rows.idUsuario;

            const hamburguesasFavoritas = await pool.query(
                `SELECT h.*, h.Nombre AS nombreHamburguesa
                 FROM Favoritos_Hamburguesa fh
                 JOIN Hamburguesa h ON fh.Hamburguesa_idHamburguesa = h.idHamburguesa
                 WHERE fh.Usuario_idUsuario = ?`,
                [idUser]
            );

            const Comentarios = await pool.query(
                `SELECT c.*, h.Nombre AS nombreHamburguesa
                FROM Comentario c
                LEFT JOIN Hamburguesa h ON c.Hamburguesa_idHamburguesa = h.idHamburguesa
                WHERE c.Usuario_idUsuario = ?`,
                [idUser]
            );

            const restaurantesFavoritos = await pool.query(
                `SELECT r.*
                 FROM Favoritos_Restaurante fr
                 JOIN Restaurante r ON fr.Restaurante_NIT = r.NIT
                 WHERE fr.Usuario_idUsuario = ?`,
                [idUser]
            );

            if (rows) {
                return {
                    usuario: rows,
                    hamburguesasFavoritas: hamburguesasFavoritas,
                    comentarios: Comentarios,
                    restaurantesFavoritos: restaurantesFavoritos
                };
            } else {
                console.log('No se encontró el Usuario');
                return null;
            }

        } catch (error) {
            console.error(error);
            throw new Error("Error al consultar en la BD");
        }
    }
    static async calificacionProducto_db(idHamburguesa, calificacion) {
        try {
            const hamburguesa = await pool.query(
                `SELECT Calificacion FROM Hamburguesa WHERE idHamburguesa = ?`,
                [idHamburguesa]
            );
            const calificacionActual = Number(hamburguesa[0].Calificacion);
            const comentarios = await pool.query(
                `SELECT COUNT(*) AS cantidadCalificaciones FROM Comentario WHERE Hamburguesa_idHamburguesa = ?`,
                [idHamburguesa]
            );
            const cantidadActual = Number(comentarios[0].cantidadCalificaciones);
            const nuevaCantidad = cantidadActual + 1;
            const nuevaCalificacion = ((calificacionActual * cantidadActual) + Number(calificacion)) / nuevaCantidad;
            await pool.query(
                `UPDATE Hamburguesa SET Calificacion = ? WHERE idHamburguesa = ?`,
                [nuevaCalificacion, idHamburguesa]
            );
            console.log(`Calificación producto actualizada correctamente a ${nuevaCalificacion}`);
        } catch (error) {
            console.error(error);
            throw new Error("Error al agregar en la BD");
        }
    }    
    static async comentarHamburguesa(Descripcion, Calificacion, ImagenBase64, idLugar, idHamburguesa, Correo) {
        try {
            const idPersona = await pool.query('SELECT idUsuario FROM Usuario WHERE Correo = ?', Correo);
            const idPersona1 = idPersona[0].idUsuario;

            const __filename = fileURLToPath(import.meta.url);

            const __dirname = dirname(__filename);

            const uploadsPath = path.join(__dirname, 'uploads');
    
            // Crear el directorio si no existe
            if (!fs.existsSync(uploadsPath)) {
                fs.mkdirSync(uploadsPath);
            }
    
            // Obtener idFoto y idTipoUsuario del usuario
            const idFotoResult = await pool.query('SELECT Foto_Perfil_idFoto_Perfil FROM Usuario WHERE idUsuario = ?', [idPersona1]);
            const idTipoUsuarioResult = await pool.query('SELECT TipoUsuario_idTipoUsuario FROM Usuario WHERE idUsuario = ?', [idPersona1]);
    
            // Asegúrate de que idFoto y idTipoUsuario sean extraídos correctamente
            const idFoto = idFotoResult[0].Foto_Perfil_idFoto_Perfil
            const idTipoUsuario = idTipoUsuarioResult[0].TipoUsuario_idTipoUsuario;
    
            // Convertir la imagen Base64 a buffer y guardar en el servidor
            const buffer = Buffer.from(ImagenBase64, 'base64');
            const fileName = `hamburguesa_${idHamburguesa}.jpg`;
            const filePath = path.join(uploadsPath, fileName);
    
            // Guardar la imagen en la carpeta 'uploads'
            fs.writeFileSync(filePath, buffer);
    
            // Definir la URL donde se guardó la imagen
            const imageUrl = `/uploads/${fileName}`;

            const Restaurante = await pool.query('SELECT Restaurante_NIT FROM Hamburguesa WHERE idHamburguesa = ?', idHamburguesa);
            const nit = Restaurante[0].Restaurante_NIT;

            // Insertar el comentario en la base de datos
            await pool.query(
                `INSERT INTO Comentario (Descripcion, Calificacion, Imagen, Lugar_idLugar, Usuario_idUsuario, Usuario_Foto_Perfil_idFoto_Perfil, Usuario_TipoUsuario_idTipoUsuario, Hamburguesa_idHamburguesa, Hamburguesa_Restaurante_NIT) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [Descripcion, Calificacion, imageUrl, idLugar, idPersona1, idFoto, idTipoUsuario, idHamburguesa, nit]
            );

            // Actualizar calificaciones
            await this.calificacionRestaurante_db(nit);
            await this.calificacionHamburguesa_db(idHamburguesa);
    
            console.log('Comentario agregado correctamente');
        } catch (error) {
            console.error(error);
            throw new Error("Error al agregar en la BD");
        }
    }
    
    static async obtenerComentarios(idHamburguesa) {
        try {
            const __filename = fileURLToPath(import.meta.url);

            const __dirname = dirname(__filename);
            
            const rows = await pool.query(
                `SELECT * FROM Comentario WHERE Hamburguesa_idHamburguesa = ?`, [idHamburguesa]
            );

            console.log(rows);
            
            
            if (rows.length === 0) {
                return { message: "No se encontraron comentarios." };
            }
    
            const comentariosConImagenBase64 = rows.map((comentario) => {
                console.log(comentario.Imagen);
                const imagePath = path.join(__dirname, comentario.Imagen);
                
                let imagenBase64 = null;
                
                try {
                    const imageBuffer = fs.readFileSync(imagePath);
                    imagenBase64 = imageBuffer.toString('base64');
                } catch (error) {
                    console.error(`Error al leer la imagen: ${comentario.Imagen}`, error);
                    
                }
                
                return {
                    Descripcion: comentario.Descripcion,
                    Calificacion: comentario.Calificacion,
                    ImagenBase64: imagenBase64,  // Imagen en Base64
                    Lugar_idLugar: comentario.Lugar_idLugar,
                    Usuario_idUsuario: comentario.Usuario_idUsuario,
                    Usuario_Foto_Perfil_idFoto_Perfil: comentario.Usuario_Foto_Perfil_idFoto_Perfil,
                    Usuario_TipoUsuario_idTipoUsuario: comentario.Usuario_TipoUsuario_idTipoUsuario,
                    Hamburguesa_idHamburguesa: comentario.Hamburguesa_idHamburguesa,
                    Hamburguesa_Restaurante_NIT: comentario.Hamburguesa_Restaurante_NIT
                };
            });
    
            return comentariosConImagenBase64;
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los comentarios de la BD");
        }
    }
    static async calificacionRestaurante_db(NIT) {
        try {            
            const hamburguesas = await pool.query(
                `SELECT Calificacion FROM Hamburguesa WHERE Restaurante_NIT = ?`,
                [NIT]
            );
            let sumaCalificaciones = 0;
            hamburguesas.forEach(hamburguesa => {
                sumaCalificaciones += Number(hamburguesa.Calificacion);
            });
            const promedioCalificacion = sumaCalificaciones / hamburguesas.length;

            console.log(`El promedio de calificaciones para el restaurante ${NIT} es: ${promedioCalificacion.toFixed(2)}`);

            await pool.query(
                `UPDATE Restaurante SET Calificacion = ? WHERE NIT = ?`,
                [promedioCalificacion, NIT]
            );

            console.log('Promedio restaurante realizado')

        } catch (error) {
            console.error(error);
            throw new Error("Error al agregar en la BD");
        }
    }

    static async FavRestaurante_db(Correo, NIT, fav){
        try {

            const User = await pool.query(
                'SELECT * FROM Usuario WHERE Correo = ?',
                [Correo]
            );
            const idUser = User[0].idUsuario;
            if(fav === 1){
                const favorito = await pool.query(
                    'INSERT INTO Favoritos_Restaurante (Usuario_idUsuario, Restaurante_NIT) VALUES (?, ?)',
                    [idUser, NIT]
                );
                return 'agregado correctamente';

            }else{
                const resultado = await pool.query(
                    'DELETE FROM Favoritos_Restaurante WHERE Usuario_idUsuario = ? AND Restaurante_NIT = ?',
                    [idUser, NIT]
                );
                return 'eliminado correctamente';
            }
            
        }catch (error) {
            console.error(error);
            throw new Error("Error al agregar en la BD");
    }}
            
    static async calificacionHamburguesa_db(id) {
        try {

            const comentarios = await pool.query(
                `SELECT Calificacion FROM Comentario WHERE Hamburguesa_idHamburguesa = ?`,
                [id]
            );
            let sumaCalificaciones = 0;
            comentarios.forEach(comentario => {
                sumaCalificaciones += Number(comentario.Calificacion);
            });
            const promedioCalificacion = sumaCalificaciones / comentarios.length;

            console.log(`El promedio de calificaciones para la hamburguesa ${id} es: ${promedioCalificacion.toFixed(2)}`);

            await pool.query(
                `UPDATE Hamburguesa SET Calificacion = ? WHERE idHamburguesa = ?`,
                [promedioCalificacion, id]
            );

            console.log('Promedio hamburguesa realizado')

        } catch (error) {
            console.error(error);
            throw new Error("Error al agregar en la BD");
        }
    }

    static async FavHamburguesa_db(Correo, idHamburguesa, fav){
        try {

            const User = await pool.query(
                'SELECT * FROM Usuario WHERE Correo = ?',
                [Correo]
            );
            const idUser = User[0].idUsuario;
            
            if(fav === 1){
                const favorito = await pool.query(
                    'INSERT INTO Favoritos_Hamburguesa (Usuario_idUsuario, Hamburguesa_idHamburguesa) VALUES (?, ?)',
                    [idUser, idHamburguesa]
                );
                return 'agregado correctamente';
            }else{
                const resultado = await pool.query(
                    'DELETE FROM Favoritos_Hamburguesa WHERE Usuario_idUsuario = ? AND Hamburguesa_idHamburguesa = ?',
                    [idUser, idHamburguesa]
                );
                return 'eliminado correctamente';
            }
            
            
        } catch (error) {
            console.error(error);
            throw new Error("Error al agregar en la BD");
        }
    }


    static async hamburguesasTop() {
        try {
            const request = await pool.query('SELECT * FROM Hamburguesa ORDER BY Calificacion DESC');
            return request;
        } catch (error) {
            console.error(error);
        }
    }
}

export class productModel {

    static async createProducts(Nombre, Descripcion, Imagen, Precio, Restaurante_NIT) {
        try {
            const request = await pool.query('INSERT INTO Hamburguesa (Nombre, Calificacion, Descripcion, Imagen, Precio, Restaurante_NIT) VALUES (?,?,?,?,?,?)', [Nombre, 0, Descripcion, Imagen, Precio, Restaurante_NIT]);
            console.log(request);
            return 'Hamburguesa creada exitosamente';
        } catch (e) {
            console.error(e.message);
        }
    }

    static async readProducts(nit) {
        try {
            const request = await pool.query('SELECT * FROM Hamburguesa WHERE Restaurante_NIT = ?', [nit]);
            console.log(request);

            const hamburguesas = await Promise.all(
                request.map(async (row) => {
                    console.log('Id: ', row.idHamburguesa);

                    const favs = await pool.query('SELECT COUNT(Hamburguesa_idHamburguesa) as count FROM Favoritos_Hamburguesa WHERE Hamburguesa_idHamburguesa = ?', [row.idHamburguesa]);

                    const favs_count = Number(favs[0].count);

                    return {
                        idHamburguesa: row.idHamburguesa,
                        Nombre: row.Nombre,
                        Calificacion: row.Calificacion,
                        Descripcion: row.Descripcion,
                        Imagen: row.Imagen,
                        Precio: row.Precio,
                        Restaurante_NIT: row.Restaurante_NIT,
                        Favoritos: favs_count
                    };
                })
            );

            return hamburguesas;
        } catch (e) {
            console.error(e.message);
        }

    }

    static async updateProducts() {
        // Implementar el código para actualizar un producto
    }

    static async deleteProducts(id) {
        try {
            await pool.query('DELETE FROM Hamburguesa WHERE idHamburguesa =?', [id]);
            return true;
        } catch (error) {
            console.error(error.message);
        }
    }

    static async searchProduct(text, nit) {
        try {
            const request = await pool.query('SELECT * FROM Hamburguesa WHERE Nombre LIKE? AND Restaurante_NIT =?', ['%' + text + '%', nit]);
            console.log('Consulta', request);
            const hamburguesas = await Promise.all(
                request.map(async (row) => {
                    console.log('Id: ', row.idHamburguesa);
                    const favs = await pool.query('SELECT COUNT(Hamburguesa_idHamburguesa) as count FROM Favoritos_Hamburguesa WHERE Hamburguesa_idHamburguesa = ?', [row.idHamburguesa]);
                    const favs_count = Number(favs[0].count);
                    return {
                        idHamburguesa: row.idHamburguesa,
                        Nombre: row.Nombre,
                        Calificacion: row.Calificacion,
                        Descripcion: row.Descripcion,
                        Imagen: row.Imagen,
                        Precio: row.Precio,
                        Restaurante_NIT: row.Restaurante_NIT,
                        Favoritos: favs_count
                    };
                })
            );
            return hamburguesas;
        } catch (e) {
            console.error(e.message);
        }
    }

    static async getBestFiveH_db() {
        try {

            const request = await pool.query(
                'SELECT * FROM Hamburguesa ORDER BY Calificacion DESC LIMIT 5'
            );
            console.log('Consulta de mejores hamburguesas', request);

            return request;

        } catch (error) {
            console.error(error);
            throw new Error("Error al buscar en la BD");
        }
    }

    static async getBestFiveR_db() {
        try {

            const request = await pool.query(
                'SELECT * FROM Restaurante ORDER BY Calificacion DESC LIMIT 5'
            );
            console.log('Consulta de mejores Restaurante', request);

            return request;

        } catch (error) {
            console.error(error);
            throw new Error("Error al buscar en la BD");
        }
    }

    static async getBurgersRestaurant_db(NIT) {
        try {

            const hamburguesas = await pool.query(
                'SELECT * FROM Hamburguesa WHERE Restaurante_NIT = ?',
                [NIT]
            );

            return hamburguesas;

        } catch (error) {
            console.error(error);
            throw new Error("Error al buscar en la BD");
        }
    }


}
