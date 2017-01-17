/**
 * Module dependencies.
 */
const newrelic = require('newrelic'); // eslint-disable-line no-unused-vars
const chalk = require('chalk');
const LaunchDarkly = require('ldclient-node');

const app = require('./src');

const ldclient = LaunchDarkly.init(process.env.LAUNCH_DARKLY_KEY);

/**
 * Start Express server.
 */
ldclient.once('ready', () => {
  app.locals.ldclient = ldclient;

  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));

    console.log('  Press CTRL-C to stop\n');
  });
});
