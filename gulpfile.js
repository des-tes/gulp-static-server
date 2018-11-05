// plugins
var gulp = require('gulp'),
  sass                   = require('gulp-sass'),
  autoprefixer           = require('gulp-autoprefixer'),
  sourcemaps             = require('gulp-sourcemaps'),  
  browserSync            = require('browser-sync'),
  useref                 = require('gulp-useref'),
  uglify                 = require('gulp-uglify'),
  gulpIf                 = require('gulp-if'),
  cssnano                = require('gulp-cssnano'),
  imagemin               = require('gulp-imagemin'),
  imageminPngquant       = require('imagemin-pngquant'),
  imageminJpegRecompress = require('imagemin-jpeg-recompress'),
  cache                  = require('gulp-cache'),
  del                    = require('del'),
  runSequence            = require('run-sequence');

// file path
var Path = {
  ROOT: "./",
  HTML: 'app/*.html',
  CSS: 'app/css',
  SCSS: 'app/scss/**/*.+(scss|sass)',
  IMG: 'app/images/**/*.+(png|jpg|jpeg|gif|svg)',
  FONTS: 'app/fonts/**/*',
  JS: 'app/js/**/*.js',
  DIST: 'dist/'
};

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync.init({
    // Access URLs 'local' or 'external'
    // open: 'external',
    
    // Select port 
    // port: 3000,
    
    // Static server
    server: {
      baseDir: 'app'
    },
    
    // Dynamic server like XAMPP
    // proxy: 'app/index.html', 
    // proxy: "project.dev"    
  });
});

// sass compiler
gulp.task('sass', function() {
  return gulp.src(Path.SCSS) // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Path.ROOT))
    .pipe(gulp.dest(Path.CSS)) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// Watchers
gulp.task('watch', function() {
  // Reloads the browser whenever HTML, CSS or JS files change
  gulp.watch(Path.SCSS, ['sass']);  
  gulp.watch(Path.HTML, browserSync.reload);
  gulp.watch(Path.JS, browserSync.reload);
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {
  return gulp.src(Path.HTML)
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(Path.DIST));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      }),
      imageminPngquant(),
      imageminJpegRecompress(),
    ]))
    // Caching images that ran through imagemin
    /*
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    */
    .pipe(gulp.dest(Path.DIST + 'images'));
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src(Path.FONTS)
    .pipe(gulp.dest(Path.DIST + 'fonts'));
});

// Cleaning 
gulp.task('clean', function() {
  return del.sync(Path.DIST).then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
  );
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  );
});
