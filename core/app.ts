import Kernel from './kernel';

/**
 * Initialize the application
 */

try
{
	let canLoadCache = true;
	Kernel.bootstrap( canLoadCache );

	Kernel.windowManager();
}
catch ( err )
{
	const Exception = require( "./app/core/system/exceptions/Exception" ).default;
	( new Exception( err ) ).render();
}