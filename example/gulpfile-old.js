const gulp = require('gulp');
const sass = require('gulp-sass');
const fs = require('fs');
const useref = require('gulp-useref');
const colors = require('colors');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const cssfont64 = require('gulp-cssfont64');
const fontmin = require('gulp-fontmin');
const gulpVersionNumber = require("gulp-version-number")
const clean = require('gulp-clean');
const bump = require('gulp-bump');
const zip = require('gulp-zip');
const tinypng = require('gulp-tinypng');
const size = require('gulp-size');



gulp.task('browserSyncDist', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
});

gulp.task('test',  gulp.series('browserSyncDist', (done) => {
}));


gulp.task('zip', function (){
    return gulp.src('dist/**')
        .pipe(zip(__dirname.match(/([^\/]*)\/*$/)[1]+'.zip'))
        .pipe(gulp.dest('../')).pipe(size());	
});

gulp.task('clean', () => {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});


gulp.task('sass', () => {
  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in src/scss
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload()) 
});

gulp.task('tinypng', () => {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
        .pipe(tinypng('EQsUXkXaf-7c6PDOVvQhZzO2ng0XVSYI'))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({ stream: true })) 
});
    

/* updating PATCH of semver */

gulp.task('patch', () => {
  return gulp.src('./package.json')
	.pipe(bump())
	.pipe(gulp.dest('./'));	
});

gulp.task('copyfont', () => {
    return gulp.src('src/css/*.woff')
        .pipe(gulp.dest('dist/css'));
});


gulp.task('useref', () => {
	
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
    .pipe(browserSync.reload({ stream: true }))
})


gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
});

//
//gulp.task('watch', gulp.series('browserSync', 'sass', 'useref', (done) => {
//  gulp.watch('src/scss/**/*.scss', gulp.series('sass'))
//  gulp.watch('src/*.html', browserSync.reload({ stream: true })) 
//  gulp.watch('src/js/**/*.js', browserSync.reload({ stream: true })) 
//  gulp.watch('src/images/**/*', browserSync.reload())
//	browserSync.reload();
//  // Other watchers
//}));

// ---------------------------------------------- Gulp Watch


//var paths = {
//  sass: {
//    src: './furniture/sass/**/*.{scss,sass}',
//    dest: './furniture/css',
//    opts: {
//
//    }
//  }
//};
//
//
//gulp.task('watch:sass', function () {
//  gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
//});
//gulp.task('watch:html', function () {
//  gulp.watch('src', gulp.series('useref'));
//});
//
//
//
//gulp.task('watch', gulp.series('sass','useref','browserSync'));
//
//
//gulp.task('dist',  gulp.series('patch','sass', 'useref', 'tinypng','copyfont', (done) => {
//	console.log('-----------------------------------------------------------------');
//	console.log('|    '+' dist: compiling distribution folder content - done'.rainbow+'        |');
//	console.log('-----------------------------------------------------------------');
//    done();
//}));
//          
//gulp.task('default', function () {
//    console.log('default')
//});          
      

//gulp.task('watch', function(){
//  return gulp.watch('sass', browserSync.reload({ stream: true }));
//});

//function scripts() {
//  return gulp.src(paths.scripts.src, { sourcemaps: true })
//    .pipe(babel())
//    .pipe(uglify())
//    .pipe(concat('main.min.js'))
//    .pipe(gulp.dest(paths.scripts.dest));
//}
//
//
//function watch() {
//  gulp.watch('src/scss/**/*.scss', styles);
//  gulp.watch('src/*.html', html);
//  gulp.watch('src/js/**/*.js', scripts);
//  gulp.watch('src/images/**/*', images);	
//}
//
//exports.styles = styles;
//exports.watch = watch;
//exports.html = html;
//exports.images = images;
//
//exports.defaults = build;

//gulp.task('watch', gulp.series('browserSync', 'sass', 'useref', (done) => {
//  gulp.watch('src/scss/**/*.scss', ['sass']);
//  gulp.watch('src/*.html', browserSync.reload); 
//  gulp.watch('src/js/**/*.js', browserSync.reload); 
//  gulp.watch('src/images/**/*', browserSync.reload); 	
//  // Other watchers
//});


//text: 'ABCDEFGHIJKLMNOPQRSTUWVXYZabcdefghijklmnopqrstuwvxyz.,-!?0123456789£$%',
/*

    tagline_word3: "livelife",
    tagline_word2: "travel",
    tagline_word1: "bookhotels",
    
*/

//
//gulp.task('minifont', () => {
//    return gulp.src('src/fonts/*.ttf')
//        .pipe(fontmin({
//            text: 'livelifetravelbookhotels',
//        }))
//        .pipe(gulp.dest('src/fonts/css'));
//});
//
//gulp.task('BentonSansBoldUK', () => {
//    return gulp.src('src/fonts/BentonSansBold.ttf')
//        .pipe(fontmin({
//            text: ".,-'DONTBKWIHU",
//        }))
//        .pipe(gulp.dest('src/fonts/css'));
//});
//
//gulp.task('copyfont', () => {
//    gulp.src('src/css/*.woff')
//        .pipe(gulp.dest('dist/css'));
//});
//
//
//function minifyFont(text, cb) {
//    gulp
//        .src('src/fonts/*.otf')
//        .pipe(fontmin({
//            text: text
//        }))
//        .pipe(gulp.dest('dest/fonts'))
//        .on('end', cb);
//}
// 
//gulp.task('fonts', function(cb) {
// 
//    var buffers = [];
// 
//    gulp
//        .src('index.html')
//        .on('data', function(file) {
//            buffers.push(file.contents);
//        })
//        .on('end', () => {
//            var text = Buffer.concat(buffers).toString('utf-8');
//            minifyFont(text, cb);
//        });
// 
//});
//
//gulp.task('BentonSansBoldMini', () => {
//    gulp.src('src/fonts/css/BentonSansBoldMini.ttf')
//        .pipe(cssfont64())
//        .pipe(gulp.dest('src/fonts/css/'));
//});
//
//
//
//
//gulp.task('clean', () => {
//    return gulp.src('dist', {read: false})
//        .pipe(clean());
//});
//
//gulp.task('tinypng', () => {
//    gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
//        .pipe(tinypng('EQsUXkXaf-7c6PDOVvQhZzO2ng0XVSYI'))
//        .pipe(gulp.dest('dist/images'));
//});
//
///* updating PATCH of semver */
//gulp.task('patch', () => {
//  gulp.src('./package.json')
//	.pipe(bump())
//	.pipe(gulp.dest('./'));	
//});
//
///* removes all the content from distribution folder */
//gulp.task('clean', () => {
//    return gulp.src('dist', {read: false})
//        .pipe(clean());
//});
//
//gulp.task('manifest', () => {
//    gulp.src('./src/manifest.js')
//        .pipe(gulp.dest('./dist'));
//});
//
//
//gulp.task('useref', () =>{
//	
//	var json = fs.readFileSync("package.json", "utf8");
//	var jsonData = JSON.parse(json);
////	var version = jsonData.version.split('.');
////	var MAJOR = version[0];
////	var MINOR = version[1];
////	var PATCH = version[2];
//	
//  return gulp.src('src/*.html')
//    .pipe(useref())
//	.pipe(gulpVersionNumber({
//		'replaces': [
//			[/#{VERSION}#/g, jsonData.version],
//			[/#{DATE}#/g, '%DT%']			
//	],
//	}))	
//    .pipe(gulpIf('*.js', uglify({
//      compress: {
//        drop_console: true
//      }
//     })))
//    // Minifies only if it's a CSS file
//    .pipe(gulpIf('*.css', cssnano()))
//    .pipe(gulp.dest('dist'))
//})
//
//
//gulp.task('images', () =>{
//  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
//  .pipe(imagemin())
//  .pipe(gulp.dest('dist/images'))
//});
//
//
//gulp.task('sass', () => {
//  return gulp.src('src/scss/**/*.scss') // Gets all files ending with .scss in src/scss
//    .pipe(sass())
//    .pipe(gulp.dest('src/css'))
//    .pipe(browserSync.reload({
//      stream: true
//    }))
//});
//
//gulp.task('browserSync', () => {
//  browserSync.init({
//    server: {
//      baseDir: 'src'
//    },
//  })
//});
//
//gulp.task('browserSyncDist', () => {
//  browserSync.init({
//    server: {
//      baseDir: 'dist'
//    },
//  })
//});
//
//gulp.task('zip', function (){
//    return gulp.src('dist/**')
//        .pipe(zip(__dirname.match(/([^\/]*)\/*$/)[1]+'.zip'))
//        .pipe(gulp.dest('../')).pipe(size());	
//});
//
//
//gulp.task('dist', ['manifest','patch','sass', 'useref', 'tinypng','copyfont'], function (){
//	console.log('-----------------------------------------------------------------');
//	console.log('|    '+' dist: compiling distribution folder content - done'.rainbow+'        |');
//	console.log('-----------------------------------------------------------------');	
//  //gulp.watch('src/scss/**/*.scss', ['sass']); 	
//  // Other watchers
//});
//
//gulp.task('test', ['browserSyncDist'], function (){
//});
//
//
//gulp.task('watch', gulp.series(['browserSync', 'sass', 'useref'], function (){
//  gulp.watch('src/scss/**/*.scss', ['sass']);
//  gulp.watch('src/*.html', browserSync.reload); 
//  gulp.watch('src/js/**/*.js', browserSync.reload); 
//  gulp.watch('src/images/**/*', browserSync.reload); 	
//  // Other watchers
//});
