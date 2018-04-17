import path from 'path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import browserSync from 'browser-sync';

gulp.task('html', () => {
	const options = {
		collapseWhitespace: true,
		removeComments: true
	};

	return gulp.src(path.resolve('source', 'index.html'))
		.pipe(htmlmin(options))
		.pipe(gulp.dest('./build'));
});

gulp.task('css', () => {
	const options = {
		compress: true
	};

	const plugins = [
		autoprefixer({ browsers: ['last 2 versions'] })
	];

	return gulp.src('./source/styles.styl')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(stylus(options))
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build'));
});

gulp.task('javascript', () => {
	return gulp.src(path.resolve('source', 'script.js'))
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build'));
});
	
gulp.task('assets', () => {
	const options = {
		progressive: true,
    optimizationLevel: 5,
	};

	return gulp.src('./source/assets/*')
		.pipe(imagemin(options))
		.pipe(gulp.dest('./build/assets'));
});

gulp.task('serve', ['html', 'javascript', 'assets', 'css'], () => {
  browserSync.init({
    server: {
      baseDir: './build',
    }
  });
});

gulp.task('reload', browserSync.reload);

gulp.task('default', ['serve'], () => {
  gulp.watch('./source/**/*.styl', ['css', 'reload']);
	gulp.watch('./source/*.html', ['html', 'reload']);
  gulp.watch('./source/assets/**/*.*', ['assets', 'reload']);
  gulp.watch('./source/**/*.js', ['javascript', 'reload']);
});
