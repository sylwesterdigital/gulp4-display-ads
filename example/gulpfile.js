'use strict';

var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var image = require('gulp-image');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var bump = require('gulp-bump');
var zip = require('gulp-zip');
var size = require('gulp-size');
var useref = require('gulp-useref');
var gulpVersionNumber = require("gulp-version-number");
const cssnano = require('gulp-cssnano');


var paths = {
  styles: {
    src: 'src/scss/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */

function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del([ 'dist' ]);
}


function bsync() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })	
}

function bsyncTest() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })	
}


function imagemin() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(image({
      pngquant: false,
      optipng: true,
      zopflipng: false,
      jpegRecompress: true,
      mozjpeg: false,
      guetzli: false,
      gifsicle: false,
      svgo: false,
      concurrent: 10,
      quiet: false // defaults to false		
	}))
    .pipe(gulp.dest('dist/images'));
}

function copyfont() {
    return gulp.src('src/css/*.woff')
        .pipe(gulp.dest('dist/css'));
}

function pack() {
    return gulp.src('dist/**')
        .pipe(zip(__dirname.match(/([^\/]*)\/*$/)[1]+'.zip'))
        .pipe(gulp.dest('../')).pipe(size());	
}

function archive() {
    return gulp.src('src/**')
        .pipe(zip(__dirname.match(/([^\/]*)\/*$/)[1]+'-src.zip'))
        .pipe(gulp.dest('archive/')).pipe(size());	
}



function version() {
	var json = fs.readFileSync("package.json", "utf8");
	var jsonData = JSON.parse(json);
//	var version = jsonData.version.split('.');
//	var MAJOR = version[0];
//	var MINOR = version[1];
//	var PATCH = version[2];
	
  return gulp.src('src/*.html')
    .pipe(useref())
	.pipe(gulpVersionNumber({
		'replaces': [
			[/#{VERSION}#/g, jsonData.version],
			[/#{DATE}#/g, '%DT%']			
	],
	}))
   .pipe(gulpIf('*.js', uglify({
      compress: {
        drop_console: true
      }
     })))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))	
}


function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
	
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function workStyles() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
/*
    .pipe(babel())
*/
    //.pipe(uglify())
    //.pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
	
}

function watch() {
	gulp.watch(paths.scripts.src, scripts).on('change', browserSync.reload);
	gulp.watch(paths.styles.src, workStyles).on('change', browserSync.stream);
}

var build = gulp.series(gulp.parallel(version, imagemin, copyfont));
var work = gulp.series(gulp.parallel(bsync, watch));
var test = gulp.series(gulp.parallel(bsyncTest));


exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.bsync = bsync;
exports.imagemin = imagemin;
exports.pack = pack;
exports.copyfont = copyfont;
exports.version = version;

exports.build = build;
exports.work = work;
exports.test = test;
exports.archive = archive;





exports.default = build;