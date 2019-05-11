import Command from '../Command';
import Commands from '../Commands';

export default class HelpCommand extends Command
{
	static cmd = ".help";
	static desc = "Shows this help page or explain with more detail the specified command.";
	static fn = ( args ) =>
	{
		for( let idxCommand in Commands.commands )
		{
			console.log( Commands.commands[ idxCommand ].cmd, Commands.commands[ idxCommand ].desc );
		}
		return true;
	}
}