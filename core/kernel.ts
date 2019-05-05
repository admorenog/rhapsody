import { app } from 'electron';
import WindowRenderers from './system/windows/WindowRenderers';
import WindowRenderer from './system/windows/WindowRenderer';
import Config from './components/Config';
import Systray from './components/Systray';
import Menu from './components/Menu';

declare var config: Function;
declare var kernel: typeof Kernel;
declare var window: WindowRenderer;
declare var windows: WindowRenderers;

export default class Kernel
{
	static windows: WindowRenderers;
	static menu: Menu;
	static systray: Systray;
	static config: Config;
	static render: any;

	private static onWindowAllClosed (): void
	{
		if ( process.platform !== 'darwin' || !Config.config( "debug" ) )
		{
			app.quit();
		}
	}

	private static onReady (): void
	{
		// TODO: cargar las start_views mediante el Router
		Kernel.windows.add( "load/loader", {
			width: 350, height: 400,
			frame: false, alwaysOnTop: true, show: false,
			webPreferences: { nodeIntegration: false, contextIsolation: true }
		} );

		Kernel.windows.add( "main", { width: 800, height: 600, show: false,
			webPreferences: { nodeIntegration: false, contextIsolation: true },
			onReady: ( event ) => {
				windows.get( "load/loader" ).hide();
				//setTimeout( () => { windows.get( "load/loader" ).hide(); }, 2000 );
			}
		} );

		Kernel.windows.load( "load/loader" );
		Kernel.windows.load( "main", { ctx : Kernel.getContext() } );

		Kernel.systray = new Systray( config( "systray" ) );
	}

	private static onActivate (): void
	{
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if ( Kernel === null )
		{
			Kernel.onReady();
		}
	}

	private static initMenu ()
	{
		let menu = new Menu();
		return menu;
	}

	private static getContext ()
	{
		return {
			config: config()
		}
	}

	private static setGlobals()
	{
		global[ "kernel" ] = this;
		global[ "app" ] = app;
		Config.setGlobals();
	}

	static bootstrap ()
	{
		Kernel.setGlobals();
		Kernel.menu = Kernel.initMenu();
		Kernel.windows = new WindowRenderers();
		app.on( 'window-all-closed', Kernel.onWindowAllClosed );
		app.on( 'ready', Kernel.onReady );
		app.on( 'activate', Kernel.onActivate );
	}
}