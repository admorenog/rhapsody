import Controller from '../../core/system/controllers/Controller'

class LoaderController extends Controller
{
	public load()
	{
		let window = {
			width: 600, height: 600,
			frame: false, alwaysOnTop: true, show: false,
			opacity : 0, title : "Rhapsody",
			webPreferences: { nodeIntegration: false, contextIsolation: true },
			onReady: ( event ) => {
				windows.get( "load/loader" ).show();
			}
		};
		let vars = null;
		return view( window, 'load/loader', vars );
	}
}

module.exports = LoaderController;