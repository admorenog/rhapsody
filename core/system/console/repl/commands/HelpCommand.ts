import Command from '../Command';
import Commands from '../Commands';

export default class HelpCommand extends Command
{
	static cmd = ".help";
	static desc = "Shows this help page or explain with more detail the specified command.";
	static fn = ( args ) =>
	{
		let commands = Commands.all();
		for( let idxCommand in commands )
		{
			console.log( commands[ idxCommand ].cmd, commands[ idxCommand ].desc );
		}
		return true;
	}
}