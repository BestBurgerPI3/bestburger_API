import { pool } from './db.js';

export class productModel {
    static async getAll() {
        try {
            const restaurantes = await pool.query('SELECT * FROM Restaurante');

            const restaurantesConProductos = await Promise.all(
                restaurantes.map(async (restaurante) => {
                    const productos = await pool.query(
                        'SELECT * FROM Hamburguesa WHERE restaurante_NIT = ?',
                        [restaurante.NIT] 
                    );
                    
                    return {
                        ...restaurante,
                        productos: productos
                    };
                })
            );
            
            const result = {
                restaurantes: restaurantesConProductos
            };

            return result;
        }catch (e) {
            console.error(e.message);
        }

    }
}