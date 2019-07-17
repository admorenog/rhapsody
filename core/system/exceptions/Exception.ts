export default class Exception
{
	static error : Error;
	constructor( err : Error )
	{
		Exception.error = err;
	}

	/**
	 * This method is for showing the exception formatted for command line.
	 */
	show()
	{
		console.error( Exception.error.message );
	}

	/**
	 * This method is for showing the exception in the gui mode.
	 */
	render()
	{
		console.error( Exception.error.message );
		throw Exception.error;
	}
}