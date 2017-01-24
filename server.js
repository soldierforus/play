/**
 * Module dependencies.
 */
const newrelic = require('newrelic');
const chalk = require('chalk');
const dotenv = require('dotenv');
const LaunchDarkly = require('ldclient-node');

dotenv.config({ silent: true });

const app = require('./src');

const features = LaunchDarkly.init(process.env.LAUNCH_DARKLY_KEY);

/**
 * Start Express server.
 */
features.once('ready', () => {
  app.locals.newrelic = newrelic;
  app.locals.features = features;

  app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));

    console.log('  Press CTRL-C to stop\n');
  });
});

function shutdown() {
  app.close((err) => {
    if (err) {
      newrelic.noticeError(err);
    }
  });
}

process.on('SIGTERM', () => {
  shutdown();
  newrelic.shutdown({ collectPendingData: true, timeout: 3000 }, () => process.exit(0));
});

process.on('uncaughtException', (err) => {
  shutdown();
  newrelic.noticeError(err);
  newrelic.shutdown({ collectPendingData: true, timeout: 3000 }, () => process.exit(1));
});
