var gulp = require("gulp"),
  rimraf = require("rimraf"),
  notify = require("gulp-notify"),
  plumber = require("gulp-plumber"),
  sourcemaps = require("gulp-sourcemaps"),
  pug = require("gulp-pug"),
  //CSS
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  //Server
  browserSync = require("browser-sync").create(),
  // plugins for build
  concat = require("gulp-concat"),
  gulpif = require("gulp-if"),
  uglify = require("gulp-uglify"),
  imagemin = require("gulp-imagemin"),
  mozjpeg = require("imagemin-mozjpeg"),
  pngquant = require("imagemin-pngquant"),
  csso = require("gulp-csso"),
  zip = require("gulp-zip"),
  gutil = require("gulp-util"),
  ftp = require("vinyl-ftp"),
  ftpConfig = require("./ftpConfig"),
  isDevelopment = require("./gulp/util/env");

console.log(isDevelopment);
//Конфиг
var paths = {
  src: "./app/",
  dist: "./dist/",
};
//Компиляция SASS
gulp.task("sass", function () {
  return gulp
    .src([
      paths.src + "sass/**/*.{sass,scss}",
      "!" + paths.src + "sass/**/_*.{sass,scss}",
    ])
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError)) // plumber doesn't work here
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulpif(!isDevelopment, csso({ comments: false })))
    .pipe(gulp.dest(paths.src + "/css/"))
    .pipe(browserSync.stream())
    .pipe(notify("SASS Compiled"));
});
//Компиляция Pug
gulp.task("pug", function () {
  return gulp
    .src([paths.src + "pug/*.pug", "!" + paths.src + "pug/_*.pug"])
    .pipe(plumber())
    .pipe(pug({ pretty: isDevelopment }))
    .pipe(gulp.dest(paths.src))
    .pipe(browserSync.stream())
    .pipe(notify("Pug Compiled"));
});
//Конкатанация JavaScript
gulp.task("concat", function () {
  return gulp
    .src(paths.src + "/javascript/**/*.js")
    .pipe(concat("all.js"))
    .pipe(gulpif(!isDevelopment, uglify()))
    .pipe(gulp.dest(paths.src + "/js/"))
    .pipe(browserSync.stream())
    .pipe(notify("Scripts concatenated"));
});

//Перезагрузка страницы
gulp.task("browser-sync", function () {
  browserSync.init(["css/*.css", "js/*.js", "*.html"], {
    server: {
      baseDir: paths.src,
    },
  });
});
/*
# ===============================================
# Vendors
# ===============================================
*/
gulp.task("libsCSS", function () {
  return gulp
    .src(["app/libs/animate/animate.css"])
    .pipe(gulpif(!isDevelopment, csso({ comments: false })))
    .pipe(concat("libs.css"))
    .pipe(gulp.dest(paths.src + "css/"));
});

gulp.task("libsJS", function () {
  return gulp
    .src([
      "app/libs/jquery/jquery-3.2.0.min.js",
      "app/libs/bootstrap/bootstrap.min.js",
      "app/libs/waypoints/jquery.waypoints.min.js",
      "app/libs/countUp/countUp.min.js",
      "app/libs/slick/slick.min.js",
    ])
    .pipe(gulpif(!isDevelopment, uglify()))
    .pipe(concat("libs.js"))
    .pipe(gulp.dest(paths.src + "js/"));
});

/*
# ===============================================
# Создание билда проэкта
# ===============================================
*/

//clean all build folder
gulp.task("cleanBuildDir", function (cb) {
  rimraf(paths.dist, cb);
});

//minify images
gulp.task("imgBuild", function () {
  return gulp
    .src(paths.src + "img/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 7 }),
        pngquant({ quality: "85-100" }),
        imagemin.svgo({ plugins: [{ removeViewBox: true }] }),
      ])
    )
    .pipe(gulp.dest(paths.dist + "img"));
});

//copy css
gulp.task("cssBuild", function () {
  return gulp.src(paths.src + "css/**/*").pipe(gulp.dest(paths.dist + "/css/"));
});
//copy js
gulp.task("jsBuild", function () {
  return gulp
    .src(paths.src + "/js/**/*.js")
    .pipe(gulp.dest(paths.dist + "/js/"));
});

//copy fonts
gulp.task("fontsBuild", function () {
  return gulp
    .src(paths.src + "/fonts/**/*.*")
    .pipe(gulp.dest(paths.dist + "/fonts/"));
});

//copy html
gulp.task("htmlBuild", function () {
  return gulp.src(paths.src + "/*.html").pipe(gulp.dest(paths.dist));
});
/*
# ===============================================
# Архивация в Zip
# ===============================================
*/
gulp.task("buildZip", function () {
  return gulp
    .src(paths.dist + "/**/*.*")
    .pipe(zip("archive.zip"))
    .pipe(gulp.dest("dist"));
});
/*
# ===============================================
# Deploy
# ===============================================
*/
var conn = ftp.create({
  host: ftpConfig.host,
  user: ftpConfig.user,
  password: ftpConfig.password,
  parallel: 3,
  log: gutil.log,
});

gulp.task("deploy", function () {
  var globs = ["dist/**"];
  return gulp
    .src(globs, { buffer: false })
    .pipe(conn.dest(ftpConfig.path))
    .pipe(
      notify({
        message: "Finished deployment.",
        onLast: true,
      })
    );
});
//clean remote ftp directory
gulp.task("deploy:clean", function (cb) {
  conn.rmdir(ftpConfig.path, cb);
});

/*
# ===============================================
# Отслеживание изменения файлов
# ===============================================
*/

gulp.task("watch", function () {
  gulp.watch(paths.src + "/sass/**/*.{sass,scss}", gulp.parallel("sass"));
  gulp.watch(paths.src + "/javascript/**/*.js", gulp.parallel("concat"));
  gulp.watch(paths.src + "/pug/**/*.pug", gulp.parallel("pug"));
});

/*
# ===============================================
# Группы тасков
# ===============================================
*/

gulp.task(
  "compile",
  gulp.parallel("sass", "pug", "concat", "libsCSS", "libsJS")
);

gulp.task(
  "build",
  gulp.series(
    "cleanBuildDir",
    "compile",
    gulp.parallel("jsBuild", "cssBuild", "fontsBuild", "htmlBuild", "imgBuild")
  )
);

//build just main parts(exclude fonts and images)
gulp.task(
  "main-build",
  gulp.series("compile", gulp.parallel("jsBuild", "cssBuild", "htmlBuild"))
);

gulp.task("zip", gulp.series("build", "buildZip"));
gulp.task("default", gulp.parallel("compile", "browser-sync", "watch"));
