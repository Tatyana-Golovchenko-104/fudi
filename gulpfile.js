const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const isDevelopment = process.env.NODE_ENV !== 'production';
const cleanCSS = require('gulp-clean-css');

const folders = {
  main_scss: 'markup/sass/main.scss',
  scss: 'markup/sass/*.scss',
  css: 'markup/css',
  html: 'markup/*.html',
  images: 'markup/sourceimages/*',
  images_min: 'markup/images'
};

const styles = () => (
  gulp.src(folders.main_scss)
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulpIf(isDevelopment, sourcemaps.write()))
  .pipe(gulp.dest(folders.css))
  )

const compressImages = () => (
  gulp.src(folders.images)
    .pipe(imagemin())
    .pipe(gulp.dest(folders.images_min))
)

const watch = () => {
 gulp.watch(folders.scss, gulp.series(styles));
 gulp.watch(folders.images, gulp.series(compressImages));
};

const serve = () => {
  browserSync.init({
    server: {
      baseDir: "markup"
    },
    port: 3000
  })

  browserSync.watch([folders.css, folders.html]).on('change', browserSync.reload);
}

const build = gulp.series(styles, compressImages);

exports.dev = gulp.series(build, gulp.parallel(watch, serve));