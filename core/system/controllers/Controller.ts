/// <reference path="../helpers/Globals.d.ts" />

import WindowRenderer from "../views/windows/WindowRenderer";

export default class Controller
{
	public static view ( window : WindowRenderer, view : string, vars? : any )
	{
		kernel.windows.add( view, window );
		kernel.windows.load( view, vars );
	}
}