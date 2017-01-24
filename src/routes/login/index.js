const passport = require('passport');
const routes = require('express').Router();
const get = require('../../controllers/login/get');

routes.get('/', get);
routes.get('/callback', passport.authenticate('auth0', { failureRedirect: '/login' }), (req, res) => {
  if (!req.user) {
    throw new Error('User Not Found or Invalid');
  }

  res.redirect('/dashboard');
});

module.exports = routes;
