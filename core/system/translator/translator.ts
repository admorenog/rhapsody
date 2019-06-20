/// <reference path="../helpers/Globals.d.ts" />

export default class Translator
{
	public static translations : object = null;

	public static translate( dotSignatureTranslationKey : string, vars : any )
	{
		if( Translator.translations == null )
		{
			Translator.translations = require(
				'../../../../storage/cache/translations'
			).default;
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
				lang = "es";
			}
		}

		// FIXME: this requires the vars for any translation, maybe we need to use
		// any different than a js for the translations
		let variableName = `Translator.translations.${ lang }( vars ).${ dotSignatureTranslationKey }`;
		return eval( variableName );
	}
}