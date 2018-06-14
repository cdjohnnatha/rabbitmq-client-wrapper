const gulp = require('gulp');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');

gulp.task('default', () => {
  gulp.watch(['app/**', 'test/**'], ['mocha']);
});

gulp.task('mocha', () => gulp.src(['test/requests/*.js'], { read: false })
  .pipe(mocha({ reporter: 'list' }))
  .on('error', gutil.log));
