const electron = require( 'electron' )
const fs = require( 'fs' )
const path = require( 'path' )

var config = JSON.parse( fs.readFileSync( electron.remote.app.getAppPath() + path.sep + 'config.json' ) );