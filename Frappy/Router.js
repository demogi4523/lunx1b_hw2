export default class Router {
  constructor() {
    this._routes = {};
  }

  addPath(path, methods, callback) {
    if (!this._routes.hasOwnProperty(path)) {
      this._routes[path] = {};
    }
    methods.forEach(method => {
      if (this._routes[path].hasOwnProperty(method)) {
        throw new Error(`WTF!? ${path} already in router!!!`);
      } 
      this._routes[path][method] = callback;
    });
  }

  getRoutes() {
    return this._routes;
  }
}
