const routes = require('express').Router();
const get = require('../../controllers/register/get');

routes.get('/', get);

module.exports = routes;
