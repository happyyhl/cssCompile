var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var postcss = require('gulp-postcss');

var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');
var syntax = require('postcss-scss');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');

 gulp.task('sass',function () {
 	return gulp.src('./app/css/index.scss')
			.pipe(autoprefixer({
	            browsers: ['last 5 versions'],
	            cascade: false
	        }))
 			.pipe(sass())
 			.pipe(gulp.dest('./public/css'))
 });

 gulp.task('default',['sass','lint','watch1']);

 gulp.task('watch1',function(){
 	return gulp.watch('./app/css/index.scss',['sass']);
 });

 // 检查脚本
gulp.task('lint', function() {
    gulp.src('./app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});


gulp.task('postCss', function () {
  var processors = [
	  autoprefixer,
	  cssnext,
	  precss
	]; 	 	
  return gulp.src('./app/style/style1.css')
  	//.pipe(sass())
    
    .pipe(sourcemaps.init())  //生成css 映射文件
    .pipe(postcss(processors))
    .pipe(cssnano())//压缩
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/po'));
});

// 默认任务
gulp.task('total', function(){
    gulp.run('lint', 'sass', 'scripts');

    // 监听文件变化
    gulp.watch('./js/*.js', function(){
        gulp.run('lint', 'sass', 'scripts');
    });
});