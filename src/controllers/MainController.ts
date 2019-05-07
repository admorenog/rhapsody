/// <reference path="../../core/system/globals.ts" />
import Controller from '../../core/system/controllers/Controller'

class MainController extends Controller
{
	public index()
	{
		let window = { width: 800, height: 600, show: false,
			webPreferences: { nodeIntegration: false, contextIsolation: true },
			onReady: ( event ) => {
				kernel.windows.get( "load/loader" ).hide();
				//setTimeout( () => { windows.get( "load/loader" ).hide(); }, 2000 );
			}
		};
		let vars = { ctx : kernel.getContext() };
		return view( window, 'main', vars );
	}
}
module.exports = MainController;