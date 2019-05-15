#!/usr/local/bin/node

const gulp = require( 'gulp' );
const livereload = require( 'gulp-livereload' );
const del = require( 'del' );
const ts = require( 'gulp-typescript' );
const sass = require( 'gulp-sass' );
const sourcemaps = require( 'gulp-sourcemaps' );
const notifier = require( 'node-notifier' );

function clean ( cb )
{
	del( [ 'app' ], cb );
	cb();
}

function jsClean ( cb )
{
	return del( [ 'app/**/*.js*' ], cb );
}

function templatesClean ( cb )
{
	return del( [ 'app/src/views/templates' ], cb );
}

function cssClean ( cb )
{
	return del( [ 'app/src/views/styles' ], cb );
}

function sassTranspile ( cb )
{
	gulp.src( './src/views/styles/app.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( gulp.dest( './app/src/views/styles' ) );

	notifier.notify( {
		title: "Sass compiled.",
		message: "Sass compiled."
	} );

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
	notifier.notify( {
		title: "Templates compiled.",
		message: "Templates compiled."
	} );
	cb();
}

function tsTranspile ( cb )
{
	var tsProject = ts.createProject( '.vscode/tsconfig.json' );

	var tsResult = tsProject.src()
		.pipe( sourcemaps.init() )
		.pipe( tsProject() )
		.on( 'error', reportError );

	tsResult.js
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest( tsProject.options.outDir ) )
		.on( 'error', reportError );
	notifier.notify( {
		title: "Typescript transpiled",
		message: "Typescript transpiled",
		icon: './core/components/gulp/gulp.png'
	} );
	cb();
};

function showMessage()
{
	notifier.notify( {
		title: "Message",
		message: "test"
	} );
}

function reportError( error )
{
	notifier.notify( {
		title: error.message,
		message: error.stack,
		icon: './core/components/gulp/error.png'
	} );
}

exports.watch = function ( cb )
{
	//livereload( { start : true } );
	gulp.watch(
		[ 'core/**/*.ts', 'src/**/*.ts', '!src/views/templates/**/*', '!src/views/styles/**/*' ],
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