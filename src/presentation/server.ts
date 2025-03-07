import express, { Router } from 'express';
import http from 'http';
import { CookieParserAdapter } from '../config/cookie';
import { envs } from '../config';

interface Options {
  port: number
  routes: Router
}

export class Server {
  public readonly app = express()
  private readonly port: number;
  private server?: http.Server
  private routes: Router

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {

    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.app.use(CookieParserAdapter.parseCookie(envs.JWT_SECRET));
    this.app.use(this.routes)

    this.server = this.app.listen(this.port, () => {
      console.log(`Server is listening on http://localhost:${this.port}`)
    })

    return this.server
  }
}