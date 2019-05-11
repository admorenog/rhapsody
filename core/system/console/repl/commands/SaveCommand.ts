import Command from '../Command';

export default class SaveCommand extends Command
{
	static cmd = ".save";
	static desc = "Save all evaluated command in this REPL session to a file.";
	static fn = ( args ) =>
	{
		return true;
	}
}