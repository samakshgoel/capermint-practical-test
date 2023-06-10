const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../services/authorization');
const roles = require('../../services/roles');
const productController = require('../../controllers/product');
const upload = require('../../services/uploadFile');

ROUTE.post('/create-product', authorize(roles.Admin), upload.single('image') , productController.createProduct);
ROUTE.patch('/update-product', authorize(roles.Admin) , upload.single('image') , productController.updateProduct);
ROUTE.delete('/delete-product', authorize(roles.Admin) , productController.deleteProduct);

ROUTE.get('/search-by-title' , authorize([roles.Admin , roles.User]), productController.searchProduct);

module.exports = ROUTE ;