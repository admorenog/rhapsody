/// <reference path="../system/Globals.d.ts" />

import { Menu as MainMenu } from 'electron';

export default class Menu
{
	public name : string;
	public template : any = [
		{
			label: 'Edit',
			submenu: [
				{
					role: 'undo'
				},
				{
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					role: 'cut'
				},
				{
					role: 'copy'
				},
				{
					role: 'paste'
				},
				{
					role: 'pasteandmatchstyle'
				},
				{
					role: 'delete'
				},
				{
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click ( item, focusedWindow )
					{
						if ( focusedWindow ) focusedWindow.reload()
					}
				},
				{
					label: 'Developer Tools',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
					click ( item, focusedWindow )
					{
						if ( focusedWindow ) focusedWindow.webContents.toggleDevTools()
					}
				},
				{
					type: 'separator'
				},
				{
					role: 'resetzoom'
				},
				{
					role: 'zoomin'
				},
				{
					role: 'zoomout'
				},
				{
					type: 'separator'
				},
				{
					role: 'togglefullscreen'
				}
			]
		},
		{
			role: 'window',
			submenu: [
				{
					role: 'minimize'
				},
				{
					role: 'close'
				}
			]
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click () { require( 'electron' ).shell.openExternal( 'http://electron.atom.io' ) }
				}
			]
		}
	];
	public menu : MainMenu;
	constructor()
	{
		if ( process.platform === 'darwin' )
		{
			this.name = app.getName();
			this.template.unshift( {
				label: this.name,
				submenu: [
					{
						role: 'about'
					},
					{
						type: 'separator'
					},
					{
						role: 'services',
						submenu: []
					},
					{
						type: 'separator'
					},
					{
						role: 'hide'
					},
					{
						role: 'hideothers'
					},
					{
						role: 'unhide'
					},
					{
						type: 'separator'
					},
					{
						role: 'quit'
					}
				]
			} )
			// Edit menu.
			this.template[ 1 ].submenu.push(
				{
					type: 'separator'
				},
				{
					label: 'Speech',
					submenu: [
						{
							role: 'startspeaking'
						},
						{
							role: 'stopspeaking'
						}
					]
				}
			)
			// Window menu.
			this.template[ 3 ].submenu = [
				{
					label: 'Close',
					accelerator: 'CmdOrCtrl+W',
					role: 'close'
				},
				{
					label: 'Minimize',
					accelerator: 'CmdOrCtrl+M',
					role: 'minimize'
				},
				{
					label: 'Zoom',
					role: 'zoom'
				},
				{
					type: 'separator'
				},
				{
					label: 'Bring All to Front',
					role: 'front'
				}
			]
		}
		this.menu = MainMenu.buildFromTemplate( this.template );
		MainMenu.setApplicationMenu( this.menu );
	}
}
