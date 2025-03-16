import cookieParser from "cookie-parser";

export class CookieParserAdapter {
  static parseCookie(secret?: string, options = {}) {
    const defaultOptions = {
      decode: decodeURIComponent,
    };

    return cookieParser(secret, { ...defaultOptions, ...options });
  }
}
