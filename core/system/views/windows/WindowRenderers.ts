/// <reference path="../../helpers/Globals.d.ts" />

import WindowRenderer from './WindowRenderer';
import Renderer from '../Render'
import { BrowserWindow } from 'electron';

export default class WindowRenderers
{
	private windows: object = {};
	private static render: any;

	constructor()
	{
		WindowRenderers.initRender();
		global[ "windows" ] = this;
	}

	public add ( name: string, options: object )
	{
		this.windows[ name ] = new WindowRenderer(
			new BrowserWindow( options )
		);
		this.windows[ name ].showOnReady();
		this.windows[ name ].deleteOnClosed();
		this.windows[ name ].setCustomOptions( options );
	}

	public get ( name: string )
	{
		return this.windows[ name ];
	}

	public load ( name: string, vars? : any )
	{
		let windowRenderer : WindowRenderer = this.get( name );
		let window = windowRenderer.window;

		WindowRenderers.render.load( window, name, vars );

		if ( config[ 'app' ][ "debug" ] )
		{
			window.webContents.openDevTools();
		}

		window.on( 'closed', windowRenderer.onClosed );
		//window.on( 'ready-to-show', window.show );
	}

	private static initRender()
	{
		if( !this.render )
		{
			this.render = new Renderer( {
				viewPath: 'app/src/views',
				viewProtcolName: 'view',
				useAssets: true,
				assetsPath: 'res',
				assetsProtocolName: 'asset'
			} );
			this.render.use( 'ejs' );
		}
	}
}