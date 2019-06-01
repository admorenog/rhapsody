export default class Translator
{
	public static translations : object = null;

	public static translate( dotSignatureTranslationKey : string, vars : any )
	{
		if( Translator.translations == null )
		{
			Translator.translations = require( '../../../../storage/cache/translations' ).default;
		}

		return eval( `Translator.translations.${ dotSignatureTranslationKey }` );
	}
}