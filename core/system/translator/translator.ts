/// <reference path="../helpers/Globals.d.ts" />

export default class Translator
{
	public static translations : object = null;

	public static translate( dotSignatureTranslationKey : string, vars : any )
	{
		if( Translator.translations == null )
		{
			Translator.translations = require( '../../../../storage/cache/translations' ).default;
		}

		let lang = config[ "app" ].lang;

		if( lang == "system" )
		{
			lang = app.getLocale();
		}

		let variableName = `Translator.translations.${ lang }.${ dotSignatureTranslationKey }`;

		return eval( variableName );
	}
}