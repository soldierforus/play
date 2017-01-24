module.exports = (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  const features = req.app.locals.features;
  const user = {
    key: req.session,
    anonymous: true,
  };
  const template = 'login';
  const vars = {
    title: 'Login',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
  };

  if (features) {
    features.variation('social-auth', user, false, (err, show) => (res.render(template, Object.assign(vars, { social: show }))));
  } else {
    return res.render(template, vars);
  }
};
