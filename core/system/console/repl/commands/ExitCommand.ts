import Command from '../Command';

export default class ExitCommand extends Command
{
	static cmd = ".exit";
	static desc = "Exit the REPL.";
	static fn = () =>
	{
		console.log( "Bye~" );
		return false;
	}
}