import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import glob from 'glob';
import path from 'path';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';
import info from './package.json';
import wpPot from 'gulp-wp-pot';
import uglify from 'gulp-uglify';
import PurgecssPlugin from 'purgecss-webpack-plugin';

const PRODUCTION = yargs.argv.prod;

const server = browserSync.create();
const sass = require('gulp-sass')(require('sass'));

export const styles = () => {
  return src(['src/scss/public.scss', 'src/scss/admin.scss'])
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
    .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: 'ie8' })))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(server.stream());
};

export const images = () => {
  return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/images'));
};

export const scripts = () => {
  return src(['src/js/public.js', 'src/js/admin.js'])
    .pipe(named())
    .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [],
                  compact: true,
                },
              },
            },
            {
              test: /\.(sa|sc|c)ss$/i,
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
        mode: PRODUCTION ? 'production' : 'development',
        devtool: !PRODUCTION ? 'eval' : false,
        output: {
          filename: '[name].js',
          pathinfo: true,
        },
        cache: {
          type: 'filesystem',
          buildDependencies: {
            config: [__filename],
          },
        },
        plugins: [
          new PurgecssPlugin({
            paths: glob.sync(path.join(__dirname, 'src'), { nodir: true }),
          }),
        ],
      })
    )
    .pipe(dest('dist/js'));
};

export const copy = () => {
  return src([
    'src/**/*',
    '!src/{images,js,scss}',
    '!src/{images,js,scss}/**/*',
  ]).pipe(dest('dist'));
};

export const compress = () => {
  return src([
    '**/*',
    '!node_modules{,/**}',
    '!bundled{,/**}',
    '!src{,/**}',
    '!.babelrc',
    '!.gitignore',
    '!gulpfile.babel.js',
    '!package.json',
    '!package-lock.json',
  ])
    .pipe(zip(`${info.name}.zip`))
    .pipe(dest('bundled'));
};

export const pot = () => {
  return src('**/*.php')
    .pipe(
      wpPot({
        domain: 'blueblocs',
        package: info.name,
      })
    )
    .pipe(dest(`languages/${info.name}.pot`));
};

export const clean = () => del(['dist']);

export const watchForChanges = () => {
  watch('src/scss/**/*.scss', styles);
  watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
  watch(
    ['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'],
    series(copy, reload)
  );
  watch('src/js/**/*.js', series(scripts, reload));
  watch('**/*.php', reload);
};

export const serve = (done) => {
  server.init({
    proxy: 'http://localhost/atlas/', // put your local website link here,
    online: true,
  });
  done();
};

export const reload = (done) => {
  server.reload();
  done();
};

export const dev = series(
  clean,
  parallel(styles, images, copy, scripts),
  serve,
  watchForChanges
);

export const build = series(
  clean,
  parallel(styles, images, copy, scripts),
  pot,
  compress
);

export default dev;
