import Controller from '../../core/system/controllers/Controller'

export default class LoaderController extends Controller
{
	public load()
	{
		let window = {
			width: 200, height: 300,
			frame: false, alwaysOnTop: true, show: false,
			opacity : 0, title : "Rhapsody",
			webPreferences: { nodeIntegration: false, contextIsolation: true },
			onReady: ( event : Event ) => {
				windows.get( "load/loader" ).show();
			}
		};
		let vars = null;
		return view( window, 'load/loader', vars );
	}
}
