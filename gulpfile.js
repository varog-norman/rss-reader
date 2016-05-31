var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');

gulp.task('jade', () => {
    return gulp.src([
        'src/jade/*.jade',
        '!src/jade/_*jade'
    ])
        .pipe(plumber())
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload())
});

gulp.task('stylus', () => {
    return gulp.src('src/stylus/style.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(gulp.dest('dist/css'))
        .pipe(connect.reload())
});

gulp.task('scripts', () => {
    return gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload())
    });

gulp.task('default', ['jade', 'stylus', 'scripts'], () => {

    connect.server({
        root: 'dist',
        livereload: true
    });

    gulp.watch(['src/jade', 'src/jade/**/*.jade'], ['jade']);
    gulp.watch(['src/stylus', 'src/stylus/**/*.styl'], ['stylus']);
    gulp.watch(['src/js', 'src/js/**/*.js'], ['scripts']);

})
