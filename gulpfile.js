'use strict';
require('dotenv').config();

const { src, dest, watch } = require('gulp');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const _PROD = process.env.MODE === 'production' ? true : false;
const outputLocation = './dist';
const sassLocation = './src/css/main.scss';

function compileSass(done) {
    src(sassLocation)
        .pipe(gulpif(!_PROD, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer({
                cascade: false,
            })
        )
        .pipe(cleanCSS())
        .pipe(gulpif(!_PROD, sourcemaps.write('.')))
        .pipe(dest(outputLocation));
    done();
}

function watchSass() {
    watch(sassLocation, compileSass);
}

exports.compileSass = compileSass;
exports.watchSass = watchSass;
