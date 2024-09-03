import { productModel } from '../models/models.js';

export class productController {
    static async getProducts (req, res) {
        console.log(req.body);
        const nit = req.body.nit;
        const hamburguesas = await productModel.getProducts(nit);
        
        res.json(hamburguesas);
    }

    
}