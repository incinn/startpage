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

const webpack = require('webpack-stream');
const terser = require('gulp-terser');

const outputLocation = './dist';
const sassLocation = './src/css/main.scss';
const pugLocation = './src/index.pug';
const tsLocation = './src/js/entry.ts';
const imageLocation = './src/img/**/*';

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
        .pipe(
            webpack({
                mode: _PROD ? 'production' : 'development',
                entry: tsLocation,
                module: {
                    rules: [
                        {
                            test: /\.tsx?$/,
                            use: 'ts-loader',
                            exclude: /node_modules/,
                        },
                    ],
                },
                resolve: {
                    extensions: ['.tsx', '.ts', '.js'],
                },
                output: {
                    filename: 'bundle.js',
                },
            })
        )
        .pipe(
            terser({
                mangle: true,
                compress: true,
            })
        )
        .pipe(dest(outputLocation));
}

function copyImages() {
    return src(imageLocation).pipe(dest(outputLocation));
}

function revision() {
    return src(outputLocation + '/**/*.{css,js,jpg,jpeg,png}')
        .pipe(rev())
        .pipe(dest(outputLocation))
        .pipe(revdel())
        .pipe(rev.manifest())
        .pipe(dest(outputLocation));
}

function rewrite() {
    const manifest = readFileSync(outputLocation + '/rev-manifest.json');
    return src([outputLocation + '/**/*.html', outputLocation + '/**/*.css'])
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
    parallel(compilePug, compileSass, compileTypescript, copyImages),
    revision,
    rewrite
);
exports.watch = series(
    cleanup,
    parallel(compilePug, compileSass, compileTypescript, copyImages),
    watchSource
);
exports.clean = cleanup;
