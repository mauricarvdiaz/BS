'use strict'

const conexion = require('../database/db');

/**
 * @Description Controlador para la tabla productos, es donde se hacen las consultas a la tabla Products. Se exporta el controlador para que pueda ser usado en ../routes/product 
 *      - Cada funcion tiene una conslta sql, la execucion de la consulta y retorna el resultado obtenido.
 * 
 * */
const controller = {

    /**
     * /productos
     * 
     * @param {*} req 
     * @param {*} res se usa para enviar la respuesta, en este caso, todos los productos.
     * 
     * @Description Se usa para obtener todos los productos.
    */
    getProduct: (req, res) => {
        const sql = 'Select * From product Order By name ASC';

        conexion.query(sql, (err, results) => {
            if(err) throw err;
            else res.status(200).send(results)
        })
    },

    /**
     * /search/:search
     * 
     * @param {*} req se usa para obtener parametros de la url, en este caso, search (nombre a usar para buscar los productos)
     * @param {*} res se usa para enviar la respuesta, en este caso, productos que en su nombre contengan la palabra de :search 
     * 
     * @Description Se usa para buscar productos que contengan el nombre obtenido por ruta.
    */
    searchProduct: (req, res) => {
        const productSearch = '%'.concat(req.params.search.concat('%'));
        const sql = "Select * From product Where name LIKE ? Order By name ASC";

        conexion.query(sql, [productSearch], (err, results) => {
            if(err) throw err;
            else res.status(200).send(results)
        })
    },

    /**
     * /filterCategory/:category
     * 
     * @param {*} req se usa para obtener parametros de la url, en este caso, category
     * @param {*} res se usa para enviar la respuesta, en este caso, productos de una categoria. 
     * 
     * @Description Se usa para buscar los productos de una categoria.
     */
    productFilterByCategory: (req, res) => {
        const categorySearch = req.params.category;
        const sql = 'Select product.name As name, category.name As category, product.url_image, product.price, product.discount From product Inner Join category On product.category = category.id Where category.name = ? Order By name ASC';

        conexion.query(sql, [categorySearch], (err, results) => {
            if(err) throw err;
            else res.status(200).send(results)
        })
    },
    
    /**
     * /filterPrice/:price
     * 
     * @param {*} req se usa para obtener parametros de la url, en este caso, price (rango de precio Ej 1000-5000).
     * @param {*} res se usa para enviar la respuesta, en este caso, productos en un rango de precios. 
     * 
     * @Description Se usa para obtner productos que se encuentren dentro de un rango de precio.
     */
    productFilterByPrice: (req, res) => {
        const [minPrice, maxPrice] = req.params.price.split('-');
        const sql = 'Select * From product Where price Between ? And ?';
    
        conexion.query(sql, [minPrice, maxPrice], (err, results) => {
            if(err) throw err;
            else res.status(200).send(results);
        });
    },

    /**
     * /productDiscount
     * 
     * @param {*} req 
     * @param {*} res se usa para enviar la respuesta, en este caso, productos ordenador de mayor a menor descuento.
     * 
     * @Description Se usa para obtener los productos que tienen descuento ordenados de mayor a menor.  
     */
    productMoreDiscount: (req, res) => {
        const sql = 'Select * From product Where discount > 0 Order By discount DESC';
        conexion.query(sql, (err, results) => {
            if(err) throw err;
            else res.status(200).send(results);
        });
    }
}

module.exports = controller;