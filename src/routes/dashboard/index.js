const routes = require('express').Router();
const get = require('../../controllers/dashboard/get');

routes.get('/', get);

module.exports = routes;
