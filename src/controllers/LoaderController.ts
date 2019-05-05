/// <reference path="../../core/system/globals.ts" />
import Controller from '../../core/system/controllers/Controller'

class LoaderController extends Controller
{
	public load()
	{
		let window = {
			width: 350, height: 400,
			frame: false, alwaysOnTop: true, show: false,
			webPreferences: { nodeIntegration: false, contextIsolation: true }
		};
		return view( window, 'load/loader' );
	}
}