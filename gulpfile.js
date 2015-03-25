var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');

var paths = {
	sass: ['./sass/**/*.scss']
};

gulp.task('default', ['sass']);


gulp.task('sass', function() {
  return gulp.src('./sass/skyblue.scss')
    .pipe(sass({
        style: 'expanded',
        errLogToConsole: false,
        onError: function(err) {
            return notify().write(err);
        }
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifyCss())
    .pipe(gulp.dest('./css'))
    .pipe(notify({ message: 'SkyBlue css generated' }));
});

gulp.task('watch', function() {
	gulp.watch(paths.sass, ['sass']);
});