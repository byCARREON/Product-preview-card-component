const { src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

// Images
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require("gulp-webp");
const avif = require("gulp-avif");

function css(done) {

    src('src/scss/**/*.scss') 
        .pipe( sourcemaps.init())
        .pipe( plumber())
        .pipe( sass() ) 
        .pipe( postcss([ autoprefixer(), cssnano() ]))
        .pipe( sourcemaps.write('.'))
        .pipe( dest("build/css") );
    done(); 
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    done();
}

function versionWebp(done) {
    const options = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(options) )
        .pipe( dest('build/img') )
    done();
}

function versionAvif(done) {
    const options = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(options) )
        .pipe( dest('build/img') )
    done();
}

function images(done) {
    const options = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(options)) )
        .pipe( dest('build/img') )
    done();
}

exports.css = css;
exports.images = images;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(images, versionWebp, versionAvif, dev);