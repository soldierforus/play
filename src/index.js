
/**
 * Module dependencies.
 */
const path = require('path');

const dotenv = require('dotenv');
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const RedisStore = require('connect-redis')(session);
const flash = require('express-flash');

const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const multer = require('multer');
const rollbar = require('rollbar');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ silent: true });

/**
 * API keys and Passport configuration.
 */
require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.locals.env = process.env;


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.originalUrl}`);
  }
  next();
});

/**
 * Express middleware..
 */
app.use(expressStatusMonitor());
app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new RedisStore({
    url: process.env.REDIS_URL,
  }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/register' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/dashboard') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(process.cwd(), 'public'), { maxAge: 31557600000 }));

const loginCtlr = require('./controllers/login');
const registerCtlr = require('./controllers/register');
const forgotCtlr = require('./controllers/forgot');
const dashboardCtlr = require('./controllers/dashboard');

/**
 * Primary app routes.
 */
app.get('/login', loginCtlr.get);
app.get('/register', registerCtlr.get);
app.get('/forgot', forgotCtlr.get);
app.get('/dashboard', dashboardCtlr.get);

app.get('/auth/callback', passport.authenticate('auth0', { failureRedirect: '/login' }), (req, res) => {
  if (!req.user) {
    throw new Error('user null');
  }
  console.log(req.user);
  res.redirect('/dashboard');
});

app.get('/.well-known/acme-challenge/:acmeToken', (req, res) => {
  const acmeToken = req.params.acmeToken;
  let acmeKey;

  if (process.env.ACME_KEY && process.env.ACME_TOKEN) {
    if (acmeToken === process.env.ACME_TOKEN) {
      acmeKey = process.env.ACME_KEY;
    }
  }

  for (const key in process.env) {
    if (key.startsWith('ACME_TOKEN_')) {
      const num = key.split('ACME_TOKEN_')[1];
      if (acmeToken === process.env[`ACME_TOKEN_${num}`]) {
        acmeKey = process.env[`ACME_KEY_${num}`];
      }
    }
  }

  if (acmeKey) res.send(acmeKey);
  else res.status(404).send();
});

app.get('*', (req, res) => {
  res.redirect('/login');
});

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
} else {
  app.use(rollbar.errorHandler(process.env.ROLLBAR_ACCESS_TOKEN));
}

module.exports = app;
