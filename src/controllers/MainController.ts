import Controller from '../../core/system/controllers/Controller'
import Graph from '../models/Graph'

export default class MainController extends Controller
{
	public index ()
	{
		let window = {
			width: 800, height: 600, show: false, transparent: false,
			opacity: 0, title: "Rhapsody",
			webPreferences: { nodeIntegration: false, contextIsolation: true },
			onReady: ( event ) =>
			{
				//kernel.windows.get( "main" ).hide();
				kernel.windows.get( "main" ).show();

				showSlowly( "load/loader", 0 );
				setTimeout( function ()
				{
					kernel.windows.get( "load/loader" ).hide();
					kernel.windows.get( "main" ).show();
					showSlowly( "main", 0 );
				}, 2000 );

				function showSlowly ( view, opacity )
				{
					opacity += 0.01
					kernel.windows.get( view ).setOpacity( opacity );
					if ( opacity < 1 )
					{
						setTimeout( () =>
						{
							showSlowly( view, opacity );
						}, 5 );
					}
				}
			}
		};

		let graphInfo = new Graph();

		graphInfo.get().then( ( results : any[] ) =>
		{
			let vars = { ctx : config, graphInfo : results };
			return view( window, 'main', { vars : vars } );
		} );
	}
}