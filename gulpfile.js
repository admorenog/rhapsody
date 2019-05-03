const gulp = require( 'gulp' );
const del = require( 'del' );
const ts = require( 'gulp-typescript' );
const sass = require( 'gulp-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );

function clean ( cb )
{
	del( [ 'app' ], cb );
	cb();
}

function jsClean ( cb )
{
	return del( [ 'app/**/*.js' ], cb );
}

function templatesClean( cb )
{
	return del( [ 'app/src/views/templates' ], cb );
}

function cssClean( cb )
{
	return del( [ 'app/src/views/styles' ], cb );
}

function sassTranspile ( cb )
{
	gulp.src( './src/views/styles/app.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( gulp.dest( './app/src/views/styles' ) );
	cb();
}

function cssMinify ( cb )
{
	// body omitted
	cb();
}

function jsMinify ( cb )
{
	// body omitted
	cb();
}

function publish ( cb )
{
	// body omitted
	cb();
}

function templatesCopy ( cb )
{
	gulp.src( 'src/views/templates/**/*' )
		.pipe( gulp.dest( 'app/src/views/templates' ) );
	cb();
}

function tsTranspile ( cb )
{
	var tsProject = ts.createProject( '.vscode/tsconfig.json' );

	var tsResult = tsProject.src()
		.pipe( sourcemaps.init() )
		.pipe( tsProject() );

	tsResult.js
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( tsProject.options.outDir ) );
	cb();
};

exports.watch = function ( cb )
{
	gulp.watch(
		[ 'src/**/*.ts', '!src/views/templates/**/*', '!src/views/styles/**/*' ],
		gulp.series( jsClean, tsTranspile )
	);
	gulp.watch(
		[ 'src/views/templates/**/*' ],
		gulp.series( templatesClean, templatesCopy )
	);
	gulp.watch(
		[ 'src/views/styles/**/*' ],
		gulp.series( cssClean, sassTranspile )
	);
	cb();
};

exports.default = gulp.series(
	clean,
	gulp.parallel(
		sassTranspile,
		tsTranspile,
		templatesCopy
	)
);

exports.prod = gulp.series(
	clean,
	gulp.parallel(
		sassTranspile,
		tsTranspile,
		templatesCopy
	),
	gulp.parallel(
		cssMinify,
		jsMinify
	),
	publish
);