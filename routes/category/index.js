const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../services/authorization');
const roles = require('../../services/roles');
const categoryController = require('../../controllers/category');

ROUTE.post('/create-category', authorize(roles.Admin) , categoryController.createCategory);
ROUTE.patch('/update-category', authorize(roles.Admin) , categoryController.updateCategory);

module.exports = ROUTE ;