var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rimraf = require('rimraf'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
	  pug = require('gulp-pug'),
    //CSS
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    //Server
    browserSync = require('browser-sync').create(),
    // plugins for build
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    csso = require('gulp-csso'),
    zip = require('gulp-zip');

//Конфиг
var paths = {
  src: './app/',
  dist: './dist/'
}

//Компиляция SASS
gulp.task('sass', function () {
   return gulp.src([paths.src + 'sass/**/*.{sass,scss}', '!' + paths.src + 'sass/**/_*.{sass,scss}'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // plumber doesn't work here
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.src + '/css/'))
    .pipe(browserSync.stream())
    .pipe(notify("SASS Compiled"));
});
//Компиляция Pug
gulp.task('pug', function () {
    return gulp.src([paths.src + 'pug/*.pug', '!' + paths.src + 'pug/_*.pug'])
    .pipe(plumber())
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(paths.src))
    .pipe(browserSync.stream())
    .pipe(notify("Pug Compiled"));
});
//Конкатанация JavaScript
gulp.task('concat', function() {
  return gulp.src(paths.src+'/javascript/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest(paths.src + '/js/'))
    .pipe(browserSync.stream())
    .pipe(notify("Scripts concatenated"));
});



//Перезагрузка страницы
gulp.task("browser-sync", function() {
        browserSync.init(["css/*.css", "js/*.js","*.html"], {
            server: {
                baseDir: paths.src
            }
        });
    });
/*
# ===============================================
# Создание билда проэкта
# ===============================================
*/

//clean build folder
gulp.task('cleanBuildDir', function (cb) {
    rimraf(paths.dist, cb);
});

//minify images
gulp.task('imgBuild', function () {
    return gulp.src(paths.src + 'img/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.dist + 'img'))
});

//minify css
gulp.task('cssBuild', function () {
    return gulp.src(paths.src + 'css/**/*')
        .pipe(csso())
        .pipe(gulp.dest(paths.dist + 'css/'))
});
//minify js
gulp.task('jsBuild', function() {
  return gulp.src(paths.src+'/javascript/**/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist + '/js/'))
});

//copy fonts
gulp.task('fontsBuild', function() {
  return gulp.src(paths.src+'/fonts/**/*.*')
    .pipe(gulp.dest(paths.dist + '/fonts/'))
});

//copy html
gulp.task('htmlBuild', function() {
  return gulp.src(paths.src+'/*.html')
    .pipe(gulp.dest(paths.dist))
});

//copy libraries
gulp.task('libsBuild', function() {
  return gulp.src(paths.src+'/libs/**/*.*')
    .pipe(gulp.dest(paths.dist+'/libs/'))
});
/*
# ===============================================
# Архивация в Zip
# ===============================================
*/
gulp.task('buildZip', function() {
  return gulp.src(paths.dist+'/**/*.*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist'))
});


/*
# ===============================================
# Отслеживание изменения файлов
# ===============================================
*/

gulp.task('watch', function() {
    gulp.watch(paths.src + '/sass/**/*.{sass,scss}', ['sass']);
    gulp.watch(paths.src + '/javascript/**/*.js', ['concat']);
    gulp.watch(paths.src + '/pug/**/*.pug', ['pug']);
});

/*
# ===============================================
# Группы тасков
# ===============================================
*/

gulp.task('compile', ['sass','pug','concat']);
gulp.task('build', function(callback) {
  runSequence('cleanBuildDir','compile',['jsBuild', 'cssBuild', 'fontsBuild', 'htmlBuild', 'imgBuild','libsBuild'], callback);
});
gulp.task('default', ['compile','browser-sync','watch']);
