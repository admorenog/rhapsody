export default class Exception
{
	static error : Error;
	constructor( err : Error )
	{
		Exception.error = err;
	}

	show()
	{
		console.error( Exception.error.message );
	}
}