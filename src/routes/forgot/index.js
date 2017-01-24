const routes = require('express').Router();
const get = require('../../controllers/forgot/get');

routes.get('/', get);

module.exports = routes;
