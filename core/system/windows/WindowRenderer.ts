import WindowRenderers from "./WindowRenderers";

declare var windows: WindowRenderers;
export default class WindowRenderer
{
	public window: Electron.BrowserWindow;

	constructor ( window: Electron.BrowserWindow )
	{
		this.window = window;
	}

	public showOnReady()
	{
		//this.window.on( 'ready-to-show', this.window.show );
	}

	public hide()
	{
		this.window.hide();
	}

	public show()
	{
		this.window.show();
	}

	public setOpacity( opacity )
	{
		this.window.setOpacity( opacity );
	}

	public deleteOnClosed()
	{
		this.window.on( 'closed', this.onClosed );
	}

	public onClosed()
	{
		this.window = null;
	}

	public setCustomOptions( options: any )
	{
		if( options.onReady )
		{
			this.window.on( 'ready-to-show', options.onReady );
		}
	}
}