import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export default class Config
{
	public filename : string = 'config.json';
	public encoding : string = 'utf-8';
	public debug : boolean = true;

	constructor( filename? : string )
	{
		this.filename = filename || this.filename;
		let fullname: string = app.getAppPath() + path.sep + this.filename;
		let config = JSON.parse( fs.readFileSync( fullname, this.encoding ) );
		this.debug = config.debug;
	}
}