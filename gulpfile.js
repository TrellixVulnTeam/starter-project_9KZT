const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');

// dart-sass supports Sass @use
const sass = require('gulp-dart-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');                                           
const browserSync = require('browser-sync').create();

const {src, series, parallel, dest, watch} = require('gulp');



//Copy html files to build folder

function copyHtml(){
    return src('src/*.html')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
}

//Optimizing images

function imgOpt(){
    return src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'));
}

//Concatenate and minify JavaScript files

function jsTask(){
    return src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app-min.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'))
    .pipe(browserSync.stream());
}

//Compile and minify SCSS

function style(){
    return src('src/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        overrideBrowserslist: 'last 2 versions',
        grid: true

    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css'))

    //4. stream changes to all browser
    .pipe(browserSync.stream());
}

//Watch changes on save
function reactToChanges(){
    browserSync.init({
        server:{
            baseDir: 'build'
        }
    });
    gulp.watch('src/scss/**/*.scss', style);
    gulp.watch('src/*.html', copyHtml, browserSync.reload);
    gulp.watch('src/js/**/*.js').on('change', jsTask, browserSync.reload);


}

exports.default = parallel(copyHtml, imgOpt, jsTask, style, reactToChanges); 