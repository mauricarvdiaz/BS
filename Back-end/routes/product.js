'use strict'

const express = require('express');
const ProductController = require('../controllers/product');

const router = express.Router();

/**Rutas http que usan las funciones del controlador de productos. */

/**
 * get: 
 *  @Description Ruta para obtener todos los productos 
*/
router.get('/productos', ProductController.getProduct);

/**
 * get:
 *  @Description Ruta para buscar productos que en su nombre contengan la palabra que :search contiene.
*/
router.get('/search/:search', ProductController.searchProduct);

/**
 * get: 
 *  @Description Ruta para buscar los productos de una categoria
 */
router.get('/filterCategory/:category', ProductController.productFilterByCategory);

/**
 * get: 
 *  @Description Ruta para buscar los productos con descuento.
 * 
 * Esta ruta no se uso en este proyecto.
 */
router.get('/productDiscount', ProductController.productMoreDiscount);

/**
 * get: 
 *  @Description Ruta para buscar los productos que se encuentren dentro del rango de precio :price (Ej. :price = 1000-5000)
 *  
 * Esta ruta no se uso en este proyecto.
*/
router.get('/filterPrice/:price', ProductController.productFilterByPrice);




module.exports = router;

