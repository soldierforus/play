/**
 * GET /teams/create
 * Create a Team page.
 */
exports.get = (req, res) => {
  res.render('teams/create', {
    title: 'Create a Team',
  });
};
