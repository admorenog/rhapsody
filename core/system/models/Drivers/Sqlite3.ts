import Sqlite3Connection from "../Connections/Sqlite3Connection";

export default class Sqlite3
{
	private static connection: Sqlite3Connection;

	public static getConnection (): Sqlite3Connection
	{
		Sqlite3.connection = Sqlite3.connection != null
			? Sqlite3.connection
			: new Sqlite3Connection;

		return this.connection;
	}

	public getDatabase( database : string )
	{
		return Sqlite3.getConnection().getDatabaseConnection( database );
	}
}