var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var fileinclude = require('gulp-file-include');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var del = require('del');

gulp.task('default', ['watch', 'public', 'css', 'js', 'html'], function() {
  browserSync.init({
    server: 'build'
  });
});

gulp.task('watch', function() {
  gulp.watch('app/views/**/*.html', ['html', 'reload']);
  gulp.watch('app/js/**/*.js', ['js', 'reload']);
  gulp.watch('app/css/**/*.sass', ['css']);
  gulp.watch('app/public/**/*', ['public', 'reload']);
});

gulp.task('css', function() {
  return gulp.src('./app/css/main.sass')
    .pipe(sass())
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return browserify('./app/js/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('html', function() {
  return gulp.src('./app/views/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('clean public', function() {
  return del('./build/public/**/*');
});

gulp.task('public', ['clean public'], function() {
  return gulp.src('./app/public/**/*')
    .pipe(gulp.dest('./build/public/'));
});

gulp.task('css:build', function() {
  return gulp.src('./app/css/main.sass')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.stream());
});

gulp.task('js:build', function() {
  return browserify('./app/js/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('html:build', function() {
  return gulp.src('./app/views/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('public:build', function() {
  return gulp.src('./app/public/**/*')
    .pipe(gulp.dest('./dist/public/'));
});

gulp.task('clean', function() {
  return del('dist/**/*');
});

gulp.task('build', ['clean'], function() {
  var tasks = ['css:build', 'js:build', 'public:build', 'html:build'];
  tasks.forEach(function(task) {
    gulp.start(task)
  });
  //console.log('Build completed!');
});

gulp.task('reload', function() {
  browserSync.reload();
});
