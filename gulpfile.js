'use strict';

var gulp      = require('gulp-help')(require('gulp')),
  babel       = require('gulp-babel'),
  del         = require('del'),
  sequence    = require('gulp-sequence'),
  gutil       = require('gulp-util');

//config object for source inputs and desired output paths, makes it easier to change the locations of various assets
//without having to actually modify the gulp tasks
var config = require('./gulp.config.js');

gulp.task('babelify', false, function() {
  return gulp.src(config.srcJs)
    .pipe(babel({
      presets: ['es2015']
    }))
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
  sequence('clean', 'babelify')(callback);
});
gulp.task('default', false, ['build', 'watch']);
