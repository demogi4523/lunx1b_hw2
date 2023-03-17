import Regexer from "./Regexer.js";

export default class Router {
  constructor() {
    this._routes = {};
    this._regexer = new Regexer();
  }

  addPath(path, methods, callback) {
    const isValidRegex = this._regexer.isValidRegex(path);
    
    if (!isValidRegex) {
      if (!this._routes.hasOwnProperty(path)) {
        this._routes[path] = {};
      }
      methods.forEach(method => {
        if (this._routes[path].hasOwnProperty(method)) {
          throw new Error(`WTF!? ${path} already in router!!!`);
        }
        this._routes[path][method] = callback;
      });
    } else {
      methods.forEach(method => {
        if (this._regexer.has(path, method)) {
          throw new Error(`WTF!? ${path} already in router's Regexer!!!`);
        }
        this._regexer.add(path, method, callback);
      });
    }
  }

  checkRegex(path, method) {
    const isRegex = false;
    if (this._regexer.has(path, method)) {
      const { callback, parameters } = this._regexer.get(path, method);
      return { isRegex: true, callback, parameters };
    }
    return { isRegex };
  }

  getRoutes() {
    return this._routes;
  }

}
