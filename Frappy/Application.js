import { createServer, request } from "http";
import { EventEmitter } from "events";

export default class Application {
  constructor(host="localhost", port=10000, scheme="http") {
    this.host = host;
    this.port = port;
    this.scheme = scheme;

    this._emitter = new EventEmitter({
      'captureRejections': true,
    });
  }

  get_domain() {
    return `${this.scheme}://${this.host}:${this.port}`;
  }

  addRouter(router) {
    const routes = router.getRoutes();
    for (const route in routes) {
      for (const method in routes[route]) {
        const cb = routes[route][method];
        this._emitter.on(this._get_url_mask(route, method), (request, response) => {
          let body = [];
          request.on('data', (chunk) => {
            body.push(chunk);
          }).on('end', async () => {
            body = Buffer.concat(body).toString();
            // at this point, `body` has the entire request body stored in it as a string
            request.body = body;
            await response.end(await cb(request, response));
          });
        });
      }
    }
  }

  _get_url_mask(url, method) {
    return `${url}: [${method}]`;
  }

  listen() {
    this._app = createServer((request, response) => {
      const url = new URL(`${this.get_domain()}${request.url}`);
      console.log(`Response on: ${this._get_url_mask(url.pathname, request.method)}`);

      const isEmitted = this._emitter.emit(this._get_url_mask(url.pathname, request.method), request, response);
      
      if (!isEmitted) {
        response.statusCode = 404;
        response.end('Page not Found');
      }
    });

    this._app.listen(this.port, this.host, () => {
      // TODO: Дописать
      // this._emitter.on('data', (data) => {
      //   console.log(data);
      // });
      console.log(`Server is running on http://${this.host}:${this.port}`);
  });
  }

}
