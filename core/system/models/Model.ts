import DriverManager from "./Drivers/DriverManager";

export default class Model
{
	private connection = null;
	driver : string = 'sqlite';
	database : string = 'rhapsody';

	public get() : any[]
	{
		let connection = this.getConnection();
		return [];
	}

	private getConnection()
	{
		if( this.connection == null )
		{
			this.connection = DriverManager.createNewConnection( this.driver );
		}
		return this.connection;
	}
}