import WindowRenderer from './WindowRenderer';
const ElectronViewRenderer = require( 'electron-view-renderer' );
import { BrowserWindow } from 'electron';
declare var config: Function;

export default class WindowRenderers
{
	private windows: object = {};
	private static render: any;

	constructor()
	{
		WindowRenderers.initRender();
	}

	public add ( name: string, window: BrowserWindow )
	{
		this.windows[ name ] = new WindowRenderer( name, window );
		this.windows[ name ].showOnReady();
		this.windows[ name ].deleteOnClosed();
	}

	public get ( name: string )
	{
		return this.windows[ name ];
	}

	public load ( name: string, vars? : any )
	{
		let windowRenderer : WindowRenderer = this.get( name );
		let window = windowRenderer.window;

		if( vars )
		{
			// this.window.loadURL( "app/src/views/templates/test.html" );
			WindowRenderers.render.load( window, name, vars );
		}
		else
		{
			WindowRenderers.render.load( window, name );
		}
		if ( config( 'app.debug' ) )
		{
			window.webContents.openDevTools();
		}
	}

	private static initRender()
	{
		if( !this.render )
		{
			this.render = new ElectronViewRenderer( {
				viewPath: 'app/src/views/templates',
				viewProtcolName: 'view',
				useAssets: true,
				assetsPath: 'resources',
				assetsProtocolName: 'asset'
			} );
			this.render.use( 'ejs' );
		}
	}
}