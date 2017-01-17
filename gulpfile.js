const gulp = require('gulp'); // eslint-disable-line import/no-extraneous-dependencies
const browserSync = require('browser-sync'); // eslint-disable-line import/no-extraneous-dependencies
const nodemon = require('gulp-nodemon'); // eslint-disable-line import/no-extraneous-dependencies


gulp.task('default', ['browser-sync'], () => {
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: 'http://localhost:3030',
    files: ['public/**/*.*', 'src/**/*.pug'],
    browser: 'google chrome',
    port: 3000,
  });
});

gulp.task('nodemon', (cb) => {
  let started = false;

  return nodemon({
    script: 'server.js'
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});
