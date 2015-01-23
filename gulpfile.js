'use strict'

var gulp        = require('gulp')
  , purescript  = require('gulp-purescript')
  , run         = require('gulp-run')
  , runSequence = require('run-sequence')
  , jsValidate  = require('gulp-jsvalidate')
  , gulpConcat  = require('gulp-concat')
  , addSrc      = require('gulp-add-src')
  , karma       = require('gulp-karma')
  ;

var paths = {
    src: 'src/**/*.purs',
    jsDeps : [
      'bower_components/ace/src/ace.js'
    ],
    bowerSrc: [
      'bower_components/purescript-*/src/**/*.purs',
      'bower_components/purescript-*/src/**/*.purs.hs'
    ],
    dest: '',
    docs: {
        'all': {
            dest: 'MODULES.md',
            src: [
              'src/**/*.purs'
            ]
        }
    },
    exampleSrc: 'example/Main.purs',
    test: 'test/**/*.purs'
};

var options = {
    test: {
        main: 'Test.Main'
    }
};

function compile (compiler, src, opts) {
    var psc = compiler(opts);
    psc.on('error', function(e) {
        console.error(e.message);
        psc.end();
    });
    return gulp.src(src.concat(paths.bowerSrc))
        .pipe(psc)
        .pipe(jsValidate());
};

function docs (target) {
    return function() {
        var docgen = purescript.pscDocs();
        docgen.on('error', function(e) {
            console.error(e.message);
            docgen.end();
        });
        return gulp.src(paths.docs[target].src)
            .pipe(docgen)
            .pipe(gulp.dest(paths.docs[target].dest));
    }
}

function sequence () {
    var args = [].slice.apply(arguments);
    return function() {
        runSequence.apply(null, args);
    }
}

gulp.task('browser', function() {
    return compile(purescript.psc, [paths.src].concat(paths.bowerSrc), {})
        .pipe(gulp.dest('example'))
});

gulp.task('make', function() {
    return compile(purescript.pscMake, [paths.src].concat(paths.bowerSrc), {})
        .pipe(gulp.dest(paths.dest))
});

gulp.task('build:test', function() {
    return compile(purescript.psc, [paths.src, paths.test].concat(paths.bowerSrc), options.test)
        .pipe(addSrc(paths.jsDeps))
        .pipe(gulpConcat("test.js"))
        .pipe(gulp.dest("tmp"));
});

gulp.task('run:test', function(){
    return gulp.src("tmp/test.js").pipe(karma({
      configFile : "./karma.conf.js",
      action     : "run"
    }));
});

gulp.task('test', runSequence("build:test", "run:test"));

gulp.task('docs', docs('all'));

gulp.task('watch-browser', function() {
    gulp.watch(paths.src, sequence('browser', 'docs'));
});

gulp.task('watch-make', function() {
    gulp.watch(paths.src, sequence('make', 'docs'));
});

gulp.task('default', sequence('make', 'docs', 'browser'));
