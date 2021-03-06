/**
 * GET /login
 * Login page.
 */
exports.get = (req, res) => {
  res.render('dashboard/index', {
    title: 'Dashboard',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
  });
};
