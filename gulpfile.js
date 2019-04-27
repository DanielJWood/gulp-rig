// Gulp.js configuration

  // modules
const gulp = require('gulp');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');
const concat = require('gulp-concat');
const stripdebug = require('gulp-strip-debug');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const hb = require('gulp-hb');
const frontMatter = require('gulp-front-matter');
const include = require('gulp-include');

  // development mode?
let devBuild = (process.env.NODE_ENV !== 'production');

  // folders
const folder = {
    src: 'src/',
    build: 'build/',
    tmp: '.tmp/',
    public: 'public/'
  };

// image processing
gulp.task('images', function() {
  if (!devBuild) {
    var out = folder.public + 'images/';
  } else {
    var out = folder.build + 'images/';
  }
  
  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

// template injection
function inject() {
    return gulp
        .src('src/*.html')
        .pipe(frontMatter({
          property: 'data.frontMatter'
        }))
        .pipe(hb()
            .partials('./src/html/partials/**/*.hbs')
            .helpers({
              if_eq: function(a, b, opts) {
                  if (a == b) {
                      return opts.fn(this);
                  } else {
                      return opts.inverse(this);
                  }
              }
            })
        )

        .pipe(gulp.dest(folder.tmp));
}

gulp.task('inject', inject);

// html process
gulp.task('html', gulp.series('inject','images', function() {
  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }
  
  var page = gulp.src(folder.tmp + '*.html')      

  // minify production code for html...turned off by default
  // if (!devBuild) {
  //   page = page.pipe(htmlclean());
  // }

  return page.pipe(gulp.dest(out));
}));

gulp.task('js', function() {
  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }

  var file = gulp.src(folder.src + 'js/*')
    .pipe(include()) 
      

  if (!devBuild) {
    file = file
      .pipe(babel())
      .pipe(stripdebug())
      .pipe(uglify());
  }

  return file.pipe(gulp.dest(out + 'js'))
})

// CSS processing
gulp.task('css', gulp.series('images', function() {

  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }

  var postCssOpts = [
    assets({ loadPaths: ['images/'] }),
    autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
    mqpacker
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src(folder.src + 'scss/main.scss')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(out + 'css/'));

}));

gulp.task("warn", function(done){
  let intro = `\nHowdy! Welcome to...\t\t\n\n`


  let hat = 
  "             .~~~~`\\~~\\\n"+
  "            ;       ~~ \\\n"+
  "            |           ;\n"+
  "        ,--------,______|---.\n"+
  "       /          \\-----`    \\\n"+
  "       `.__________`-_______-'\n";


  let name =
  "               "  +`🤠🤠🤠🤠🤠🤠                                ` + "               \n" +
  "               "  +`🤠     🤠   🤠🤠   🤠 🤠    🤠 🤠🤠🤠🤠🤠🤠  🤠🤠🤠🤠  ` + "               \n" +
  "   _____,,;;;`;"  +`🤠     🤠  🤠  🤠  🤠 🤠🤠   🤠 🤠      🤠      ` + ";';;;,,_____ \n" +
  ",~(  )  , )~~\\|" +`🤠🤠🤠🤠🤠🤠  🤠    🤠 🤠 🤠 🤠  🤠 🤠🤠🤠🤠🤠   🤠🤠🤠🤠  ` + "|/~~( ,  (  )~; \n" +
  "' / / --`--,   "  +`🤠     🤠 🤠🤠🤠🤠🤠🤠 🤠 🤠  🤠 🤠 🤠           🤠 ` + "   .--'-- \\ \\ ` \n" +
  " /  \\    | '   " +`🤠     🤠 🤠    🤠 🤠 🤠   🤠🤠 🤠      🤠    🤠 ` + "   ` |    /  \\ \n" +
  "               "  +`🤠🤠🤠🤠🤠🤠  🤠    🤠 🤠 🤠    🤠 🤠🤠🤠🤠🤠🤠  🤠🤠🤠🤠  ` + "               \n"


  let messageNext;
  if (!devBuild) {
    messageNext =
    "\n🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩\n" +
    `🐩\t\t\t\t\t\t\t\t  🐩\n🐩 \trunning development build, sending to ${folder.public}. Giddyup\t  🐩\n🐩\t\t\t\t\t\t\t\t  🐩\n` +
    "🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩\n";

  } else {
    messageNext =
    "\n🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈\n" +
    `🙈\t\t\t\t\t\t\t\t  🙈\n🙈  \trunning development build, sending to ${folder.build}. Giddyup\t  🙈\n🙈\t\t\t\t\t\t\t\t  🙈\n` +
    "🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈\n";
  }
  let message = intro+hat+name  + messageNext;
  console.log(message)
  done();
})

  
  

// run all tasks
gulp.task('run', gulp.series('warn','html', 'css', 'js'));


// Watch files
function watchFiles() {
    // css changes
  gulp.watch(folder.src + 'scss/**/*', gulp.task('css'));

  // image changes
  gulp.watch(folder.src + 'images/**/*', gulp.task('images'));

  // html changes
  gulp.watch(folder.src + '**/*{.html,.hbs}', gulp.task('html'));

  // javascript changes
  gulp.watch(folder.src + 'js/**/*', gulp.task('js'));

}

gulp.task('watch',gulp.series('warn',watchFiles));
