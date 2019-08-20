import { protocol } from 'electron';

export default class Router
{
	private static routeProtocolName = "route";

	public static route( route : string ) : any
	{
		console.log( route );
		let splittedRoute = route.split( "@" );

		let methodName = splittedRoute[ 0 ];
		let className = splittedRoute[ 1 ];

		return import( "../../../src/controllers/" + className ).then( controllerClass =>
		{
			let controllerObject = new controllerClass.default();
			return controllerObject[ methodName ]();
		});
	}

	public static setupRouteProtocol (): void
	{
		protocol.registerBufferProtocol(
			Router.routeProtocolName,
			(
				request: Electron.RegisterBufferProtocolRequest,
				callback: (buffer?: Electron.MimeTypedBuffer | Buffer) => void
			) =>
			{
				// TODO: check the mimeType from data... maybe the router should return
				// always a MymeTypedBuffer...

				let url = request.url.replace( /route:\/\//g, '' );
				Router.route( url ).then( ( data : any ) => {

					// FIXME: if the data is undefined we have a warning
					// It's because in the controller we don't have a valid return.
					if( data == undefined )
					{
						data = null;
					}
					let resolution = {
						data : Buffer.from( data ),
						mimeType : "json"
					};
					callback( resolution );
				} ).catch( ( error : Error ) => console.error( error ) );
			},
			( error: Error ) =>
			{
				if ( error )
					console.error( error );
			}
		);
	}
}