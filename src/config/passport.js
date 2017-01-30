const Bluebird = require('bluebird');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const User = require('../models').User;
const Profile = require('../models').Profile;
const Player = require('../models').Player;

/**
 * Auth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - If it's a social account, initiate db account flow
 *       - Else create new account
 */

passport.use(new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL,
  passReqToCallback: true,
}, (req, accessToken, refreshToken, extraParams, profile, done) => {
  if (!req.user) {
    User.findOne({ where: { email: profile._json.email } }).then((existingUser) => {
      if (existingUser) {
        return existingUser.update(profile._json, {
          fields: [
            'email',
            'user_id',
            'picture',
            'identities',
            'app_metadata',
            'user_metadata',
          ],
        }).then(user => done(null, user)).catch(err => done(err));
      }
      return User.create(profile._json)
        .then(newUser => (
          Bluebird.join(
            Player.create({ user_id: newUser.id }),
            Profile.create({ user_id: newUser.id }),
            () => done(null, newUser) // eslint-disable-line comma-dangle
          )
        ))
        .catch(err => done(err));
    }).catch(err => done(err));
  } else {
    return done(null, req.user);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    return next();
  }
  res.redirect('/login');
};
