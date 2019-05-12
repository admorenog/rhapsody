import sqlite3 from 'sqlite3';
import Connection from "./Connection";

export default class Sqlite3Connection implements Connection
{
	private connector: sqlite3.sqlite3;
	constructor ()
	{
		this.connector = sqlite3.verbose();
	}

	public database ( database : string )
	{
		return new this.connector.Database( database );
	}
}