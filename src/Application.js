import { createServer } from "http";
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

  addRouter(router) {
    this._router = router;
  }

  _createListener(router) {
    // const domain = `${this.scheme}://${this.host}:${this.port}`;
    const options = {
      scheme: this.scheme,
    };

    const listener = (request, response) => {
      router.query(request, response, options);
    };
    return listener;
  }

  listen() {
    this._listener = this._createListener(this._router);
    this._app = createServer({}, this._listener);

    this._app.listen(this.port, this.host, () => {
      // TODO: Дописать
      // this._emitter.on('data', (data) => {
      //   console.log(data);
      // });
      console.log(`Server is running on http://${this.host}:${this.port}`);
  });
  }

}
