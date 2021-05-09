require('dotenv').config();

const { src, dest, watch, parallel, series } = require('gulp');
const { readFileSync } = require('fs');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revdel = require('gulp-rev-delete-original');
const _PROD = process.env.MODE === 'production' ? true : false;

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const pugLinter = require('gulp-pug-linter');
const pug = require('gulp-pug-3');

const ts = require('gulp-typescript');
const terser = require('gulp-terser');

const outputLocation = './dist';
const sassLocation = './src/css/main.scss';
const pugLocation = './src/index.pug';
const tsLocation = './src/js/index.ts';

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

function revision() {
    return src(outputLocation + '/**/*.{css,js}')
        .pipe(rev())
        .pipe(dest(outputLocation))
        .pipe(revdel())
        .pipe(rev.manifest())
        .pipe(dest(outputLocation));
}

function rewrite() {
    const manifest = readFileSync(outputLocation + '/rev-manifest.json');
    return src(outputLocation + '/**/*.html')
        .pipe(revRewrite({ manifest }))
        .pipe(dest(outputLocation));
}

function watchSource() {
    watch(sassLocation, compileSass);
    watch(pugLocation, compilePug);
    watch(tsLocation, compileTypescript);
}

exports.build = series(
    cleanup,
    parallel(compilePug, compileSass, compileTypescript),
    revision,
    rewrite
);
exports.watch = series(
    cleanup,
    parallel(compilePug, compileSass, compileTypescript),
    watchSource
);
exports.clean = cleanup;
