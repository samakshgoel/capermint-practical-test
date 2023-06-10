const express = require('express');
const ROUTE = express.Router();
const userController = require('../../controllers/user');
const authorize = require('../../services/authorization');
const roles = require('../../services/roles');

ROUTE.post('/register', userController.registerUser);
ROUTE.post('/login', userController.userLogin);

ROUTE.get('/get-my-profile' , authorize([roles.User, roles.Admin]), userController.getUserProfile);
ROUTE.patch('/update-my-profile' , authorize([roles.User, roles.Admin]), userController.updateProfile);

module.exports = ROUTE ;