import Sqlite3 from "./Sqlite3";
import Connection from "../Connections/Connection";

export default class DriverManager
{
	private static connections: {};
	public static getConnection ( driver: string ): Connection
	{
		let connections = DriverManager.connections;
		let connection = connections != undefined
			? connections[ driver ] || null
			: null;

		if ( connection == null )
		{
			switch ( driver )
			{
				case "sqlite": connection = Sqlite3.getConnection(); break;
				default: throw new Error( `Driver ${ driver } not found.` );
			}
		}

		return connection;
	}
}