import { productModel } from '../models/models.js';

export class productController {

    static async createProducts(req, res) {
        try {
            const { Nombre, Descripcion, Imagen, Precio, Restaurante_NIT, } = req.body;
            
            const data = await productModel.createProducts(Nombre, Descripcion, Imagen, Precio, Restaurante_NIT);

            res.status(201).json({ success: 'Producto creado correctamente', data });

        }   catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al crear los productos' });
        } 
    }
    
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


    //! Esta función queda en veremos 😁
    // static async updateProducts (req, res) {
    //     try {
    //         const { id, Nombre, Calificacion, Descripcion, Imagen, Precio, Restaurante_NIT, } = req.body;
            
    //         const data = await productModel.updateProducts(id, Nombre, Calificacion, Descripcion, Imagen, Precio, Restaurante_NIT);
            
    //         if(data === true) {
    //             res.status(200).json({ success: 'Producto actualizado correctamente', data });
    //         } else {
    //             res.status(404).json({ error: 'Producto no encontrado' });
    //         }
            
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ error: 'Error al actualizar los productos' });
    //     }
    // }

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