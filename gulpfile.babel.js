import gulp from 'gulp';
import sequence from 'run-sequence';
import del from 'del';
import browserify from 'gulp-browserify';
import babelify from 'babelify';
import vueify from 'vueify';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';

gulp.task('default', ['build']);

gulp.task('build', (callback) => {
  return sequence.use(gulp)(
    'clean',
    ['js', 'css', 'html'],
    callback
  );
});

gulp.task('clean', del.bind(null, [
  './dist',
]));

gulp.task('js', (callback) => {
  gulp.src(['src/pretty-autoindex.js', 'src/helper.js'])
    .pipe(browserify({
      extensions: ['.js', '.vue'],
      transform: ['babelify', 'vueify'],
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
  gulp.src('src/config.js')
    .pipe(gulp.dest('./dist'));
});

gulp.task('css', (callback) => {
  gulp.src('css/*.scss')
    .pipe(sass({
      outputStyle: "compressed",
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', (callback) => {
  gulp.src('src/index.html')
    .pipe(gulp.dest('./dist'));
});

