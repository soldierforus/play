
/**
 * Module dependencies.
 */
const path = require('path');

const rollbar = require('rollbar');
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

const routes = require('./routes');

// const multer = require('multer');
// const upload = multer({ dest: path.join(__dirname, 'uploads') });

if (process.env.NODE_ENV !== 'development') {
  rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN, {
    environment: process.env.NODE_ENV,
    endpoint: process.env.ROLLBAR_ENDPOINT,
  });
}

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
  } else if (req.user && req.path === '/dashboard') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(process.cwd(), 'public'), { maxAge: 31557600000 }));

const isAuthenticated = require('./config/passport').isAuthenticated;

/**
 * Primary app routes.
 */
app.use('/', routes);
app.get('/teams/create', isAuthenticated, require('./controllers/teams').get);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler());
} else {
  app.use(rollbar.errorHandler(process.env.ROLLBAR_ACCESS_TOKEN));
}

module.exports = app;
