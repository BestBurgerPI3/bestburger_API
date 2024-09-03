import { pool } from './db.js';

export class productModel {
    static async getProducts(nit) {
        try {
            const hamburguesas = await pool.query('SELECT * FROM Hamburguesa WHERE Restaurante_NIT = ?', [nit]);
            
            return hamburguesas;
        }catch (e) {
            console.error(e.message);
        }

    }
}