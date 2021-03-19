'use strict'

const express = require('express');
const ProductController = require('../controllers/product');

const router = express.Router();

/**Rutas http que usan las funciones del controlador de productos. */

/**Ruta para obtener todos los productos */
router.get('/productos', ProductController.getProduct);
/**Ruta para buscar productos por nombre */
router.get('/search/:search', ProductController.searchProduct);
/**Ruta para  */
router.get('/productDiscount/:limit?', ProductController.productMoreDiscount);

router.get('/filterPrice/:price', ProductController.productFilterByPrice);

/**Ruta para buscar los productos de una categoria */
router.get('/filterCategory/:category', ProductController.productFilterByCategory);


module.exports = router;

