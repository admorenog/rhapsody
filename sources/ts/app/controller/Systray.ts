import { Tray, Menu, NativeImage, nativeImage } from 'electron';

export default class Systray
{
	public iconPath: string = './resources/images/icon.png';
	public icon: NativeImage;
	public tray: Tray;
	public menu: Menu;
	public tooltip: string = "Flex query builder beta";

	constructor ( icon?: string, menu?: Menu )
	{
		this.setIcon( icon );
		this.setMenu( menu );
		this.tray = new Tray( this.icon );
		this.tray.setToolTip( this.tooltip );
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
	public setMenu ( menu: Menu )
	{
		if ( menu == null )
		{
			menu = Menu.buildFromTemplate( [
				{ label: 'Item1', type: 'radio' },
				{ label: 'Item2', type: 'radio' },
				{ label: 'Item3', type: 'radio', checked: true },
				{ label: 'Item4', type: 'radio' }
			] );
		}
		this.menu = menu;
	}
}