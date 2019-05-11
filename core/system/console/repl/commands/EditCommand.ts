import Command from '../Command';

export default class EditCommand extends Command
{
	static cmd = ".edit";
	static desc = "Open an external editor and load the script on save.";
	static fn = ( args ) =>
	{
		return true;
	}
}