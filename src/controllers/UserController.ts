import Controller from '../../core/system/controllers/Controller'

export default class UserController extends Controller
{
	public list ()
	{
		return { 1 : "Amg", 2 : "John" };
	}
}