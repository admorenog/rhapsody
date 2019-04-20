({
	"iconpath" : env( "SYSTRAY_ICON_PATH" ),
	"tooltip" : env( "SYSTRAY_TOOLTIP" ),
	"menu" : [
		{label: "Actions", submenu: [
            {label: "Preferences", click: (item, window, event) => {
                console.log( item );
				console.log( "---" );
				console.log( window );
				console.log( "---" );
				console.log( event );
                main.mainWindow.show();
            }},
        ]},
        {type: "separator"},
        {role: "quit"}
	]
})