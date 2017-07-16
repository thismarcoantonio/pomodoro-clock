var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	browserSync = require('browser-sync').create();

gulp.task('stylus', function(){
	return gulp.src('./source/style.styl')
	.pipe(stylus())
	.pipe(gulp.dest('./build'));
});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: "./build"
		}
	});

	gulp.watch('./source/*.styl', ['stylus']).on('change', browserSync.reload);
	gulp.watch('./build/*.html').on('change', browserSync.reload);
	gulp.watch('./build/*.js').on('change', browserSync.reload);
});

gulp.task('default', ['stylus', 'browserSync']);