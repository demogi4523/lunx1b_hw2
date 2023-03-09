import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Application from "./Frappy/Application.js";
import Router from "./Frappy/Router.js";
import ORM from "./Frappy/ORM.js";
import { pg_config } from "./config.js";
import { request } from "http";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = new Application();

const orm = new ORM(pg_config);
await orm.connect();
// TODO: refactor 3 lines down
await orm.init_database(path.join(__dirname, 'sql', 'schemas', 'film.sql'));
await orm.init_database(path.join(__dirname, 'sql', 'schemas', 'genre.sql'));
await orm.init_database(path.join(__dirname, 'sql', 'schemas', 'film_genre.sql'));


const router = new Router();
router.addPath('/', ['GET'], (request, response) => {
  const url = new URL(`${app.get_domain()}${request.url}`);
  const params = url.searchParams;
  const ans = [];
  for (const [key, value] of params.entries()) {
    ans.push(`Key: ${key}, Value: ${value}`);
  }
  ans.push('OK')
  return ans.join('\n');
});

router.addPath('/genre', ['POST'], async (request, response) => {
  const { name } = JSON.parse(request.body);
  response.writeHead(201, {
    'Content-Type': 'application/json',
  });
  await orm.create(path.join(__dirname, 'sql', 'genre_crud', 'create_genre.sql'), name);
  response.end(JSON.stringify({ status: 'Created' }));
});

router.addPath('/genre', ['GET'], async (request, response) => {
  const res = await orm.read_all(path.join(__dirname, 'sql', 'genre_crud', 'reads_genre.sql'));
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(res.rows));
});

router.addPath('/genre/2', ['GET'], async (request, response) => {
  const res = await orm.read(path.join(__dirname, 'sql', 'genre_crud', 'read_genre.sql'), 2);
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(res.rows));
});

router.addPath('/genre/2', ['PUT'], async (request, response) => {
  const { name } = JSON.parse(request.body);
  await orm.update(path.join(__dirname, 'sql', 'genre_crud', 'update_genre.sql'), 2, { new_genre_name: name });
  response.writeHead(405, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify({ status: 'Updated' }));
});

router.addPath('/genre/2', ['DELETE'], async (request, response) => {
  await orm.delete(path.join(__dirname, 'sql', 'genre_crud', 'delete_genre.sql'), 2);
  response.writeHead(405, {
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify({ status: 'Deleted' }));
});

app.addRouter(router);
app.listen();

// TODO: move to app stop trigger
// await orm.disconnect();
