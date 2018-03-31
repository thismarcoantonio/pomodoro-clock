import path from 'path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import htmlmin from 'gulp-htmlmin';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import rimraf from 'rimraf';
import { create } from 'browser-sync';

gulp.task('prestart', callback => rimraf('./build', callback));

gulp.task('html', () => {
	const options = {
		collapseWhitespace: true,
		removeComments: true
	};

	return gulp.src(path.resolve('source', 'index.html'))
		.pipe(htmlmin(options))
		.pipe(gulp.dest('./build'))
});

gulp.task('css', () => {
	const options = {
		compress: true
	};

	const plugins = [
		autoprefixer({ browsers: ['last 2 versions'] })
	];

	return gulp.src(path.resolve('source', 'style.styl'))
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(stylus(options))
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build'))
});

gulp.task('javascript', () => {
	return gulp.src(path.resolve('source', 'script.js'))
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build'))
});

gulp.task('serve', () => {
	const browserSync = create();
	browserSync.init({
		server: {
			baseDir: './build'
		}
	});

	gulp.watch('source/*', ['html', 'css', 'javascript'])
		.on('change', browserSync.reload);
});

gulp.task('default', ['prestart', 'html', 'css', 'javascript', 'serve']);
