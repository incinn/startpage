require('dotenv').config();

const { src, dest, watch, parallel, series } = require('gulp');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const _PROD = process.env.MODE === 'production' ? true : false;

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const pugLinter = require('gulp-pug-linter');
const pug = require('gulp-pug-3');

const ts = require('gulp-typescript');
const terser = require('gulp-terser');

const outputLocation = './dist';
const sassLocation = './src/css/**/*.scss';
const pugLocation = './src/index.pug';
const tsLocation = './src/js/**/*.ts';

function cleanup() {
    return del([outputLocation + '/**/*']);
}

function compileSass() {
    return src(sassLocation)
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
}

function watchSass() {
    watch(sassLocation, compileSass);
}

function compilePug() {
    return src(pugLocation)
        .pipe(pugLinter({ failAfterError: true, reporter: 'default' }))
        .pipe(
            pug({
                extension: 'html',
            })
        )
        .pipe(dest(outputLocation));
}

function watchPug() {
    watch(pugLocation, compilePug);
}

function compileTypescript() {
    return src(tsLocation)
        .pipe(gulpif(!_PROD, sourcemaps.init()))
        .pipe(ts({ noImplicitAny: true, outFile: 'bundle.js' }))
        .pipe(
            terser({
                mangle: true,
                compress: true,
            })
        )
        .pipe(gulpif(!_PROD, sourcemaps.write('.')))
        .pipe(dest(outputLocation));
}

function watchTypescript() {
    watch(tsLocation, compileTypescript);
}

exports.build = series(cleanup, compilePug, compileSass, compileTypescript);
exports.watch = parallel(watchPug, watchSass, watchTypescript);
exports.clean = cleanup;
