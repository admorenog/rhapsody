/**
 * ElectronViewRenderer module
 */
import { app, protocol } from 'electron'
import * as ejs from 'ejs'
import * as pug from 'pug'
import * as haml from 'haml'
import * as path from 'path'
import * as url from 'url'

const parseFilePath = ( urlString: string ) =>
{
	const parsedUrl = url.parse( urlString )
	let fileName = parsedUrl.pathname

	if ( process.platform === 'win32' ) fileName = fileName.substr( 1 )
	fileName = fileName.replace( /(?:\s|%20)/g, ' ' )

	return fileName;
}

export default class Renderer
{
	private renderers: any;
	private currentRenderer: any;
	private viewPath: string;
	private viewProtcolName: string;
	private useAssets: boolean;
	private assetsPath: string;
	private assetsProtocolName: string;
	private views: object;

	/**
	 * @constructor
	 * @param {Object} [options] - object instance options
	 * @param {string} [options.viewPath = 'views'] -
	 *     The path to the view directory where your template files live.
	 *     Example: './app/views' or 'views'
	 * @param {string} [options.viewProtcolName = 'view'] -
	 *     The name of the protocol used to capture the requested rendering
	 *     Example: 'view:///index' (note the extra slash signifying no host)
	 * @param {boolean} [options.useAssets = false] -
	 *     This option add an additional listener for 'asset://' protocol
	 *     Example 1: 'asset://css/main.css' (note that a host 'css' is added and
	 *         will be added in the search path before the remainder of the path
	 *         after the path set by options.assetsPath)
	 *     Example 1: 'asset:///main.css' (note that a host is not added and
	 *         the search path will be the path main.css after the path set
	 *         by options.assetsPath)
	 * @param {string} [options.assetsPath = 'assets'] - defines the location
	 *     where the assets will be searched for
	 * @param {string} [options.assetsProtocolName = 'asset'] -
	 *     The name of the protocol used to capture the requested asset path
	 *     and re point it to the path set by options.assetsPath. This is
	 *     really usefull when your assets are not in the same directory as your
	 *     view files
	 *     Example: 'asset://css/main.css' or 'asset://js/index.js'
	 */
	constructor ( {
		viewPath = 'views',
		viewProtcolName = 'view',
		useAssets = false,
		assetsPath = 'assets',
		assetsProtocolName = 'asset'
	}: {
		viewPath: string;
		viewProtcolName: string;
		useAssets: boolean;
		assetsPath: string;
		assetsProtocolName: string;
	} )
	{
		this.renderers = {}
		this.currentRenderer = {}
		this.views = {}

		this.viewProtcolName = viewProtcolName
		this.useAssets = useAssets
		this.assetsPath = assetsPath
		this.assetsProtocolName = assetsProtocolName
		this.viewPath = viewPath

		this._populateDefaultRenderers()
	}

	/**
	 * Allows user to define a template renderer.
	 *
	 * @param {string} name - required, name of renderer. Example: 'ejs'
	 * @param {Object} data - required
	 * @param {string} data.extension -
	 * @callback data.rendererAction - required, used to define how the processed
	 *     file should be processed based on the filePath and viewData parameters.
	 *     The callback parameter must be called, and expects the rendered HTML
	 *     output after parsing.
	 * @param {string} filePath - The path and file name to requested template file
	 * @param {Object} viewData - Additional view data in case it is supported by renderer
	 * @param {function} callback - required callback to be called with the rendered HTML
	 */
	private addRender ( name: string, { extension = null, rendererAction, viewPath }: { extension: string; viewPath: string; rendererAction: ( filePath: string, viewData: any, callback: Function ) => void; } ): void
	{
		if ( !name ) throw new Error( 'Renderer name required' )

		const data = {
			extension: extension,
			rendererAction: rendererAction,
			name: name,
		}

		this.renderers[ name ] = data
	}

	public load (
		browserWindow: Electron.BrowserWindow,
		view: string,
		viewData: any,
		{ query = {} } = {}
	) : void
	{
		this.views[ view ] = {
			viewData: viewData
		}

		query[ "_view" ] = view

		browserWindow.loadURL( url.format( {
			pathname: view,
			protocol: 'view:',
			query: query,
			slashes: true,
		} ) )
	}

	private renderTemplate ( request: Electron.RegisterBufferProtocolRequest )
	: Promise<Electron.MimeTypedBuffer>
	{
		return new Promise( ( resolve, reject ) =>
		{
			const renderer = this.currentRenderer
			const parsedUrl = url.parse( request.url, true )
			const fileName = parseFilePath( request.url )
			const extension = renderer.extension || `.${ renderer.name }`
			const filePath = path.join( this.viewPath, `${ fileName }${ extension }` )
			const viewName: string = ( typeof ( parsedUrl.query._view ) == "string" ) ?
				parsedUrl.query._view :
				null;
			const viewData = this.views[ viewName ] ?
				this.views[ viewName ].viewData :
				null;

			renderer.rendererAction( filePath, viewData, ( renderedHTML: string ) =>
			{
				resolve( {
					mimeType: 'text/html',
					data: Buffer.from( renderedHTML ),
				} );
			} );
		} );
	}

	private setupViewProtocol (): void
	{
		protocol.registerBufferProtocol(
			this.viewProtcolName,
			(
				request: Electron.RegisterBufferProtocolRequest,
				callback: (buffer?: Electron.MimeTypedBuffer | Buffer) => void
			) =>
			{
			this.renderTemplate( request ).then(
				( resolution: Electron.MimeTypedBuffer ) =>
				{
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

	private setupAssetsProtocol (): void
	{
		protocol.registerFileProtocol(
			this.assetsProtocolName,
			( request: Electron.RegisterFileProtocolRequest, callback: Function ) =>
			{
				const hostName = url.parse( request.url ).hostname
				const fileName = parseFilePath( request.url )
				const filePath: string = path.join( this.assetsPath, hostName, fileName )

				callback( filePath )
			},
			( error ) => { if ( error ) console.error( 'Failed to register asset protocol' ) } );
	}

	public use ( name: string ): void
	{
		this.currentRenderer = this.renderers[ name ];

		app.on( 'ready', () =>
		{
			this.setupViewProtocol()
			if ( this.useAssets ) this.setupAssetsProtocol();
		} )
	}

	private _populateEJSRenderer (): void
	{
		this.addRender( 'ejs', {
			extension: '.ejs',
			viewPath: 'views',
			rendererAction: ( filePath, viewData, callback ) =>
			{
				ejs.renderFile( filePath, viewData, {}, ( error: any, html: string ) =>
				{
					if ( error )
					{
						if ( error.file ) error.message += `\n\nERROR @(${ error.file }:${ error.line }:${ error.column })`
						throw error;
					}

					callback( html );
				} );
			}
		} );
	}

	private _populateHAMLRenderer (): void
	{
		this.addRender( 'haml', {
			extension: '.haml',
			viewPath: 'views',
			rendererAction: ( filePath, viewData, callback ) =>
			{
				haml.renderFile( filePath, viewData, ( error: any, html: string ) =>
				{
					if ( error )
					{
						if ( error.file ) error.message += `\n\nERROR @(${ error.file }:${ error.line }:${ error.column })`;
						throw error;
					}

					callback( html );
				} );
			}
		} );
	}

	private _populatePugRenderer (): void
	{
		this.addRender( 'pug', {
			extension: '.pug',
			viewPath: 'views',
			rendererAction: ( filePath, viewData, callback ) =>
			{
				pug.renderFile( filePath, viewData, ( error: any, html: string ) =>
				{
					if ( error )
					{
						if ( error.file ) error.message += `\n\nERROR @(${ error.file }:${ error.line }:${ error.column })`
						throw error;
					}

					callback( html );
				} );
			}
		} );
	}

	private _populateDefaultRenderers (): void
	{
		this._populateEJSRenderer();
		this._populateHAMLRenderer();
		this._populatePugRenderer();
	}
}