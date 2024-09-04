import { pool } from './db.js';

export class productModel {
    static async getProducts(nit) {
        try {
            const request = await pool.query('SELECT * FROM Hamburguesa WHERE Restaurante_NIT = ?', [nit]);
            console.log(request);
            
            const hamburguesas = await Promise.all(
                request.map(async (row) => {
                    console.log('Id: ', row.idHamburguesa);
                    
                    const favs = await pool.query('SELECT COUNT(Hamburguesa_idHamburguesa) as count FROM Favoritos_Hamburguesa WHERE Hamburguesa_idHamburguesa = ?', [row.idHamburguesa]);

                    const favs_count = Number(favs[0].count); 
                    
                    return {
                        idHamburguesa: row.Hamburguesa_ID,
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
        }catch (e) {
            console.error(e.message);
        }

    }
}