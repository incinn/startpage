'use strict';
require('dotenv').config();
const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const outputLocation = './dist';
const sassLocation = './src/css/main.scss';

function compileSass(done) {
    src(sassLocation)
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(cleanCSS())
        .pipe(dest(outputLocation));
    done();
}

function watchSass() {
    watch(sassLocation, compileSass);
}

exports.compileSass = compileSass;
exports.watchSass = watchSass;
