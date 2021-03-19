'use strict'

const conexion = require('../database/db');

/**
 * @Description Controlador para la tabla productos, es donde se hacen las consultas a la tabla Products. Se exporta el controlador para que pueda ser usado en ../routes/product 
 *      - Cada funcion tiene una conslta sql, la execucion de la consulta y retorna el resultado obtenido.
 * 
 * */
const controller = {

    //Se obtienen todos los productos
    getProduct: (req, res) => {
        const sql = 'Select * From product Order By name ASC';

        conexion.query(sql, (err, results) => {
            if(err) throw err;
            else res.status(200).send(results)
        })
    },

    //Se busca un producto por nombre.
    searchProduct: (req, res) => {
        const productSearch = '%'.concat(req.params.search.concat('%'));
        const sql = "Select * From product Where name LIKE ? Order By name ASC";

        conexion.query(sql, [productSearch], (err, results) => {
            if(err) throw err;
            else res.status(200).send(results)
        })
    },

    //Se buscan los productos de una categoria.
    productFilterByCategory: (req, res) => {
        const categorySearch = req.params.category;
        const sql = 'Select product.name As name, category.name As category, product.url_image, product.price, product.discount From product Inner Join category On product.category = category.id Where category.name = ? Order By name ASC';

        conexion.query(sql, [categorySearch], (err, results) => {
            if(err) throw err;
            else res.status(200).send(results)
        })
    },


    //Filtro de productos por rango de precio.
    productFilterByPrice: (req, res) => {
        const [minPrice, maxPrice] = req.params.price.split('-');
        const sql = 'Select * From product Where price Between ? And ?';
    
        conexion.query(sql, [minPrice, maxPrice], (err, results) => {
            if(err) throw err;
            else res.status(200).send(results);
        });
    },

    //Productos con promocion.
    productMoreDiscount: (req, res) => {
        const sql = 'Select * From product Where discount > 0 Order By discount DESC';
        conexion.query(sql, (err, results) => {
            if(err) throw err;
            else res.status(200).send(results);
        });
    }
}

module.exports = controller;