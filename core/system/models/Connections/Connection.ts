import { Database } from "sqlite3";

export default interface Connection
{
	close() : any;
	getDatabaseConnection ( database: string ) : Database;
}