const gulp = require( 'gulp' );
const notify = require( 'gulp-notify' );
const livereload = require( 'gulp-livereload' );
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
		.pipe( gulp.dest( './app/src/views/styles' ) )
		.pipe(  notify( {
			title: "Sass compiled.",
			message: "Sass compiled.",
			onLast : true
		} ) );
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
		.pipe( gulp.dest( 'app/src/views/templates' ) )
		.pipe( notify( {
			title: "Templates compiled.",
			message: "Templates compiled.",
			onLast : true
		} )
	);
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
		.pipe( gulp.dest( tsProject.options.outDir ) )
		.pipe( notify( {
			title: "Typescript compiled.",
			message: "Typescript compiled.",
			onLast : true
		} )
		.on( 'error', reportError )
	);
	cb();
};

function reportError( error )
{
	notify( {
		title: "Error",
		message: error.plugin
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