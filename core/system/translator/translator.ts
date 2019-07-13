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
					'../../../../storage/cache/translations'
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

		// FIXME: this requires the vars for any translation, maybe we need to use
		// any different than a js for the translations
		let translationsVariable = "Translator.translations";
		let variableName = (
			`${ translationsVariable }.
			${ lang }.
			${ dotSignatureTranslationKey }`
		);
		return eval( `${ variableName }` );
	}
}