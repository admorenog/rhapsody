import { protocol } from 'electron';

export default class Router
{
	private static routeProtocolName = "route";

	public static route ( route: string ): any
	{
		let splittedRoute = route.split( "@" );

		let methodName = splittedRoute[ 0 ];
		let className = splittedRoute[ 1 ];

		return import( "../../../src/controllers/" + className ).then( controllerClass =>
		{
			let controllerObject = new controllerClass.default();
			return controllerObject[ methodName ]();
		} );
	}

	public static setupRouteProtocol (): void
	{
		protocol.registerBufferProtocol(
			Router.routeProtocolName,
			(
				request: Electron.RegisterBufferProtocolRequest,
				callback: ( buffer?: Electron.MimeTypedBuffer | Buffer ) => void
			) =>
			{
				let url = request.url.replace( /route:\/\//g, '' );
				Router.route( url ).then( ( data: any ) =>
				{
					if ( data != undefined )
					{
						if ( typeof ( data ) == "object" )
						{
							data = JSON.stringify( data );
						}
						let resolution = {
							data: Buffer.from( data ),
							mimeType: "application/json"
						};
						callback( resolution );
					}
				} ).catch( ( error: Error ) => console.error( error ) );
			},
			( error: Error ) =>
			{
				if ( error )
					console.error( error );
			}
		);
	}
}