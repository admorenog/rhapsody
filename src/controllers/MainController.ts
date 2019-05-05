/// <reference path="../../core/system/globals.ts" />
import Controller from '../../core/system/controllers/Controller'

class MainController extends Controller
{
	public index()
	{
		return view( 'main' );
	}
}