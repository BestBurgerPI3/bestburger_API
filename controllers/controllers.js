import { productModel } from '../models/models.js';

export class productController {
    static async readProducts (req, res) {
        try {

            const id = req.body.nit;
            console.log(id);
            
            const data = await productModel.readProducts(id);
            
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    static async deleteProducts (req, res) {
        try {
            const id = req.body.id;
            console.log(id);

            const data = await productModel.deleteProducts(id);
            
            if(data === true) {
                res.status(200).json({ success: 'Producto eliminado'});
            }else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar los productos' });
        }
    }

}