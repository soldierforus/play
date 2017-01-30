const routes = require('express').Router();
const isAuthenticated = require('../config/passport').isAuthenticated;

const wellKnown = require('./.well-known');
const dashboard = require('./dashboard');
const profile = require('./profile');
const register = require('./register');
const forgot = require('./forgot');
const login = require('./login');
const logout = require('./logout');

routes.use('/dashboard', isAuthenticated, dashboard);
routes.use('/profile', isAuthenticated, profile);
routes.use('/register', register);
routes.use('/forgot', forgot);
routes.use('/login', login);
routes.use('/logout', isAuthenticated, logout);

routes.use('/.well-known', wellKnown);
routes.get('*', (req, res) => {
  res.redirect('/dashboard');
});

module.exports = routes;
