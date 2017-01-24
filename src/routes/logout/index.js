const routes = require('express').Router();

routes.get('/', (req, res) => {
  req.logout();
  return res.redirect('/login');
});

module.exports = routes;
