import fetch from 'node-fetch';
import GoogleFontFamily from './font';

export default class GoogleApi {
  /**
   * Fetches the list of Google Fonts from the API
   */
  static async getGoogleFonts(): Promise<GoogleFontFamily[]> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/webfonts/v1/webfonts?sort=trending&key=AIzaSyBVwVbN-QhwcaSToxnk1zCEpLuoNXBtFdo'
      );
      const json = (await response.json()) as any;
      return json.items || [];
    } catch (error) {

      console.error('Error fetching Google Fonts:', error);
      return [];
    }
  }

  /**
   * Creates a final URL to reach a Google Fonts stylesheet
   * @param font The Google Font API item
   */
  static generateUrl(font: GoogleFontFamily): string {
    // Will hold the url to reach the picked font
    const fontUrl: string[] = [];

    // Base URL
    fontUrl.push('https://fonts.googleapis.com/css?family=');
    // Adding the font name
    fontUrl.push(font.family.replace(/ /g, '+'));
    // Adding font variants
    if (font.variants && font.variants.length > 0) {
      fontUrl.push(':');
      fontUrl.push(font.variants.join(','));
    }
    // Creating the final URL
    return fontUrl.join('');
  }
}

