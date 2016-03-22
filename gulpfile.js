'use strict';

var gulp      = require('gulp-help')(require('gulp')),
  del         = require('del'),
  sequence    = require('gulp-sequence'),
  gutil       = require('gulp-util');

//config object for source inputs and desired output paths, makes it easier to change the locations of various assets
//without having to actually modify the gulp tasks
var config = require('./gulp.config.js');

gulp.task('copyJS', false, function() {
  return gulp.src(config.srcJs)
    .pipe(gulp.dest('dist'));
});

// Clean dir
gulp.task('clean', 'Deletes all build artifacts', function () {
  return del([config.destFolder]);
});

//WATCH
gulp.task('watch', 'Watches all JS, rebuilds on change', function () {
  gulp.watch([config.srcJs], ['build']);
});

gulp.task('build', false, function(callback) {
  sequence('clean', 'copyJS')(callback);
});
gulp.task('default', false, ['build', 'watch']);
