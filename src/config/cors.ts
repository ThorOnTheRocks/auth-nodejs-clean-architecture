import cors, { CorsOptions } from 'cors';

export class CorsAdapter {
  static configureCors(options: CorsOptions = {}) {
    const defaultOptions: CorsOptions = {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.APP_URL as string] 
        : true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400
    };

    const mergedOptions = { ...defaultOptions, ...options };
    return cors(mergedOptions);
  }
}