import { verbose, sqlite3, Database } from 'sqlite3';
import Connection from "./Connection";

export default class Sqlite3Connection implements Connection
{
	private connector: sqlite3;
	private databaseConn: Database;
	private database : string;

	constructor ()
	{
		this.connector = verbose();
	}

	public getDatabaseConnection ( database: string ) : Database
	{
		this.database = database;
		this.databaseConn = this.databaseConn != null
			? this.databaseConn
			: new this.connector.Database( database );

		return this.databaseConn;
	}

	public close() : void
	{
		this.databaseConn.close( () => {
			throw new Error( `Cannot connecto to ${this.database}.` );
		});
	}
}