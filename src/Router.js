export default class Router {
  constructor() {
    this._routes = {};
  }

  addPath(path, methods, callback) {
    if (this._routes.hasOwnProperty(path)) {
      throw new Error(`WTF!? ${path} already in router!!!`);
    }
    this._routes[path] = {};
    methods.forEach(method => {
      this._routes[path][method] = callback;
    });
  }

  query(request, response, options) {
    const host = request.headers.host;
    const scheme = options.scheme;
    
    const url = new URL(`${scheme}://${host}${request.url}`);
    const params = url.searchParams;
    const path = url.pathname;
    const method = request.method;

    try {
      const cb = this._routes[path][method];
      response.end(cb(params));
    } catch (error) {
      response.writeHead(404);
      response.end("Page not Found");
    }
  }
}
