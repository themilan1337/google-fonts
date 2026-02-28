import fetch from 'node-fetch';
import GoogleFontFamily from './font';

export default class GoogleApi {
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

  static generateUrl(font: GoogleFontFamily): string {
    const fontUrl: string[] = [];

    fontUrl.push('https://fonts.googleapis.com/css?family=');
    fontUrl.push(font.family.replace(/ /g, '+'));

    if (font.variants && font.variants.length > 0) {
      fontUrl.push(':');
      fontUrl.push(font.variants.join(','));
    }

    return fontUrl.join('');
  }
}