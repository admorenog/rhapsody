import Sqlite3Connection from "../Connections/Sqlite3Connection";

export default class Sqlite3
{
	public static createConnection() : Sqlite3Connection
	{
		return new Sqlite3Connection();
	}
}