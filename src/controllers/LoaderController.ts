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
		let vars = null;
		return view( window, 'load/loader', vars );
	}
}

module.exports = LoaderController;