/// <reference path="../helpers/Globals.d.ts" />

export default class Translator
{
	public static translations : object = null;

	public static translate( dotSignatureTranslationKey : string, vars : any )
	{
		if( Translator.translations == null )
		{
			try
			{
				Translator.translations = require(
					'../../../../tmp/translations'
				).default;
			}
			catch ( error )
			{
				console.log( error );
			}
		}

		let lang = config[ "app" ].lang;

		if( lang == "system" )
		{
			if( app != undefined || app != null )
			{
				lang = app.getLocale();
			}
			else
			{
				lang = "en";
			}
		}

		let translationsVariable = "Translator.translations";
		let variableName = `${ translationsVariable }.${ lang }.${ dotSignatureTranslationKey }`;
		return eval( `${ variableName }` );
	}
}