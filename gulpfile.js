const gulp         = require('gulp');
const { parallel, series } = require('gulp');
const sass         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify       = require('gulp-uglify');
const { notify }   = require('browser-sync');
const imagemin     = require('gulp-imagemin');
const del = require('del');
const browserSync  = require('browser-sync').create();



function browsersync() {
 browserSync.init({
  server: {
   baseDir: "app/"
  },
  notify: false
 })
}


function styles() {
 return gulp.src('app/scss/style.scss')
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(concat('style.min.css'))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  }))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.stream())
};

function scripts() {
 return gulp.src([
  'node_modules/jquery/dist/jquery.js',
  'node_modules/slick-carousel/slick/slick.js',
  'app/js/main.js'
 ])
 .pipe(concat('main.min.js'))
 .pipe(uglify())
 .pipe(gulp.dest('app/js'))
 .pipe(browserSync.stream())
}

function images() {
 return gulp.src('app/images/**/*.*')
 .pipe(imagemin([
  imagemin.gifsicle({ interlaced: true }),
  imagemin.mozjpeg({ quality: 75, progressive: true }),
  imagemin.optipng({ optimizationLevel: 5 }),
  imagemin.svgo({
   plugins: [
    { removeViewBox: true },
    { cleanupIDs: false }
   ]
  })
 ]))
 .pipe(gulp.dest('dist/images'))
}

function build() {
 return gulp.src([
  'app/**/*.html',
  'app/css/style.min.css',
  'app/js/main.min.js'
 ], {base: 'app'})
 .pipe(gulp.dest('dist'))
}

function cleanDist() {
 return del('dist')
}

function watching() {
 gulp.watch(['app/scss/**/*.scss'], styles);
 gulp.watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
 gulp.watch(['app/**/*.html']).on('change', browserSync.reload);
}



exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.images = images;
exports.build = build;
exports.watching = watching;
exports.cleanDist = cleanDist ;

exports.build = series(cleanDist, images, build);
exports.default = parallel(styles, scripts, browsersync, watching);

