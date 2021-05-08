'use strict';
require('dotenv').config();

const { src, dest, watch, parallel } = require('gulp');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const _PROD = process.env.MODE === 'production' ? true : false;

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const pugLinter = require('gulp-pug-linter');
const pug = require('gulp-pug-3');

const outputLocation = './dist';
const sassLocation = './src/css/main.scss';
const pugLocation = './src/index.pug';

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

function compilePug(done) {
    src(pugLocation)
        .pipe(pugLinter({ failAfterError: true, reporter: 'default' }))
        .pipe(
            pug({
                extension: 'html',
            })
        )
        .pipe(dest(outputLocation));
    done();
}

function watchPug() {
    watch(pugLocation, compilePug);
}

exports.build = parallel(compilePug, compileSass);
exports.watch = parallel(watchPug, watchSass);
