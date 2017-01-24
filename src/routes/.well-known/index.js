const routes = require('express').Router();
const get = require('../../controllers/.well-known/get');

routes.get('/acme-challenge/:acmeToken', get);

module.exports = routes;
