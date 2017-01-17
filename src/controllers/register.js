/**
 * GET /register
 * Registration page.
 */
exports.get = (req, res) => {
  if (req.user) {
    req.flash('info', { msg: `${req.user.email} already registered.` });
    return res.redirect('/dashboard');
  }
  res.render('register', {
    title: 'Register',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
  });
};
