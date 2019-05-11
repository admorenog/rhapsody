export default class Command
{
	static cmd: string;
	static desc: string;
	static fn: Function = ( args: string[] ) =>
	{
		console.error( `Command ${ Command.cmd } not found.` );
		return true;
	};
}