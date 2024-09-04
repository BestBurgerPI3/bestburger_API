import { productModel } from '../models/models.js';

export class productController {
    static async getProducts (req, res) {
        const id = req.body.nit;
        console.log(id);

        const data = await productModel.getProducts(id);

        res.json(data);
    }


}