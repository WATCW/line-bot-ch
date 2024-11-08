const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.homeRoutes);

/**
 *  @description add item
 *  @method GET /add-item
 */
route.get('/add-items', services.add_item)

/**
 *  @description for update user
 *  @method GET /update-user
 */
//route.get('/update-item', services.update_item)


// API
route.post('/api/add-items', controller.create);
route.get('/api/items', controller.find);
//route.put('/api/items/:id', controller.update);
//route.delete('/api/items/:id', controller.delete);


module.exports = route