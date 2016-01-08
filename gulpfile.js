var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    jade         = require('gulp-jade'),
    connect      = require('gulp-connect'),
    stylus       = require('gulp-stylus'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    rimraf       = require('gulp-rimraf'),
    rename       = require('gulp-rename'),
    gulpIf       = require('gulp-if'),
    jeet         = require('jeet'),
    autoprefixer = require('autoprefixer-stylus'),
    STYL_FILES   = ['src/styles/**/*.styl'],
    JADE_FILES   = ['src/views/**/*.jade'],
    JS_FILES     = ['src/js/**/*.js'],
    PUBLIC_FILES = ['public/**/*'],
    ENV          = process.env.NODE_ENV || 'development';

gulp.task('clean', function () {
    return gulp.src(['public/*.html', 'public/css', 'public/js'], { read: false })
        .pipe(plumber())
        .pipe(rimraf())
});

gulp.task('views', function () {
    gulp.src(JADE_FILES)
        .pipe(plumber())
        .pipe(jade({
            pretty: ENV === 'development'
        }))
        .pipe(gulp.dest('public'));
});

gulp.task('urlFallback', function () {
    gulp.src('public/index.html')
        .pipe(plumber())
        .pipe(gulp.dest('public'))
});

gulp.task('images', function () {
    gulp.src(['src/images/**/*'])
        .pipe(gulp.dest('public/images'));
});

gulp.task('fonts', function () {
    gulp.src(['src/fonts/*'])
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('styles', function () {
    gulp.src(STYL_FILES)
        .pipe(plumber())
        .pipe(stylus({
            compress: ENV === 'production',
            use: [
                jeet(),
                autoprefixer()
            ]
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('js', function () {
    return gulp.src([
        'bower_components/angular/angular.js',
        'src/js/*.js'
    ])
    .pipe(plumber())
    .pipe(concat('application.js'))
    .pipe(gulpIf(ENV === 'production', uglify()))
    .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function () {
    gulp.watch(JADE_FILES, ['views']);
    gulp.watch(PUBLIC_FILES, ['reload']);
    gulp.watch(STYL_FILES, ['styles']);
    gulp.watch(JS_FILES, ['js']);
});

gulp.task('connect', function () {
    connect.server({
        root: 'public',
        livereload: true,
        fallback: 'public/index.html'
    });
});

gulp.task('reload', function () {
    gulp.src(PUBLIC_FILES)
        .pipe(connect.reload());
});

gulp.task('build', ['views', 'styles', 'js']);
gulp.task('default', ['build', 'watch', 'connect', 'images', 'fonts']);
