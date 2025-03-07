import cookieParser from 'cookie-parser';

export class CookieAdapter {
  static parseCookie() {
    return cookieParser()
  }
}