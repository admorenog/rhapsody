import Command from '../Command';

export default class LoadCommand extends Command
{
	static cmd = ".load";
	static desc = "Load JS from a file into the REPL session";
	static fn = () =>
	{
		return true;
	}
}