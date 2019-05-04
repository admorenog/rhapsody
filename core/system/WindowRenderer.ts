export default class WindowRenderer
{
	private name: string;
	public window: Electron.BrowserWindow;

	constructor ( name: string, window: Electron.BrowserWindow )
	{
		this.name = name;
		this.window = window;
	}

	public showOnReady()
	{
		this.window.on( 'ready-to-show', this.window.show );
	}

	public hide()
	{
		//this.window.hide();
	}

	public deleteOnClosed()
	{
		this.window.on( 'closed', this.onClosed );
	}

	public onClosed()
	{
		this.window = null;
		this.name = null;
	}

}