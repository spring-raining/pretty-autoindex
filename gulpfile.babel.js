import gulp from 'gulp';
import sequence from 'run-sequence';
import del from 'del';
import browserify from 'gulp-browserify';
import babelify from 'babelify';
import vueify from 'vueify';
import uglify from 'gulp-uglify';

gulp.task('default', ['build']);

gulp.task('build', (callback) => {
  return sequence.use(gulp)(
    'clean',
    ['js', 'html'],
    callback
  );
});

gulp.task('clean', del.bind(null, [
  './dist',
]));

gulp.task('js', (callback) => {
  gulp.src('src/main.js')
    .pipe(browserify({
      extensions: ['.js', '.vue'],
      transform: ['babelify', 'vueify'],
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('html', (callback) => {
  gulp.src('src/index.html')
    .pipe(gulp.dest('./dist'));
});

