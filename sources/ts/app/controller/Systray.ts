import { app, Tray, Menu, NativeImage, nativeImage } from 'electron';
import * as path from 'path'

export default class Systray
{
	public iconPath: string = './resources/images/icon.png';
	public icon: NativeImage;
	public tray: Tray;
	public menu: Menu;
	public tooltip: string = "Flex query builder beta";

	constructor ( systrayConfig?: any )
	{
		this.setIcon( app.getAppPath() + path.sep + systrayConfig.iconpath );
		this.setMenu( systrayConfig.menu );
		this.tray = new Tray( this.icon );
		this.tray.setToolTip( systrayConfig.tooltip );
		this.tray.setContextMenu( this.menu );
	}

	public setIcon ( icon: string = null ): void
	{
		if ( icon != null )
		{
			this.iconPath = icon;
		}
		this.icon = nativeImage.createFromPath( this.iconPath );
		this.icon = this.icon.resize( { width: 16, height: 16 } );
	}
	public setMenu ( menu: Array<object> )
	{
		if ( menu == null )
		{
			this.menu = Menu.buildFromTemplate( [
				{ label: 'Item1', type: 'radio' },
				{ label: 'Item2', type: 'radio' },
				{ label: 'Item3', type: 'radio', checked: true },
				{ label: 'Item4', type: 'radio' }
			] );
		}
		else
		{
			this.menu = Menu.buildFromTemplate( menu );
		}
	}
}