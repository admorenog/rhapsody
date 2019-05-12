import Sqlite3 from "./Sqlite3";
import Connection from "../Connections/Connection";

export default class DriverManager
{
	private static connections : {};
	public static createNewConnection( driver : string ) : Connection
	{
		let connection = DriverManager.connections[ driver ] || null;

		if( connection == null )
		{
			switch( driver )
			{
				case "sqlite" : connection = Sqlite3.createConnection(); break;
				default : throw new Error( `Driver ${driver} not found.` );
			}
		}

		return connection;
	}
}