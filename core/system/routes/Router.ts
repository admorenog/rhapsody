export default class Router
{
	public static route( route : string )
	{
		let splittedRoute = route.split( "@" );

		let methodName = splittedRoute[ 0 ];
		let className = splittedRoute[ 1 ];

		import( "../../../src/controllers/" + className ).then( controllerClass =>
		{
			let controllerObject = new controllerClass.default();
			controllerObject[ methodName ]();
		});
	}
}