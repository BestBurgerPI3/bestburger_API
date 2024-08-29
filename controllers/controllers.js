import { productModel } from '../models/models';

export class productController {
    static async getAllProducts (req, res) {
        const products = await productModel.getAll();
        res.json(products);
    }
}