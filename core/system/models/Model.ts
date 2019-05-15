/// <reference path="../Globals.d.ts" />

import DriverManager from "./Drivers/DriverManager";
import Connection from "./Connections/Connection";
import { Database } from "sqlite3";

export default abstract class Model
{
	private connection: Connection = null;
	private database: Database = null;
	protected abstract driver: string;
	protected abstract databaseName: string;
	protected abstract tableName: string;

	public async get ( columns?: string[] ): Promise<any[]>
	{
		// TODO: we need to create a query builder that pipe the methods.
		let database = this.getDatabaseConnection( this.databaseName );
		let result = [];
		return new Promise( ( resolve, reject ) =>
		{
			database.each( `SELECT * FROM ${ this.tableName }`, ( err: any, row: any ) =>
			{
				if ( err ) { reject( err ); }
				result.push( row );
			},
				( err, count ) =>
				{
					if ( err ) { reject( err ); }
					resolve( result );
				} );
		} );
	}

	private getConnection (): Connection
	{
		if ( this.connection == null )
		{
			this.connection = DriverManager.getConnection( this.driver );
		}
		return this.connection;
	}

	private getDatabaseConnection ( database: string ): Database
	{
		let connection = this.getConnection();
		return connection.getDatabaseConnection( database );
	}
}