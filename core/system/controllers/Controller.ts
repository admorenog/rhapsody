/// <reference path="../helpers/Globals.d.ts" />
export default class Controller
{
	public static view ( window, view, vars )
	{
		kernel.windows.add( view, window );
		kernel.windows.load( view, vars );
	}
}