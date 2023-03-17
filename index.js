import Application from "./Frappy/Application.js";
import Router from "./Frappy/Router.js";
import { Film } from "./models/Film.js";
import { Genre } from "./models/Genre.js";
import { Film_Genre } from "./models/Film_Genre.js";


const app = new Application();

(async () => {
  await Genre.sync();
  await Film.sync();
  await Film_Genre.sync();
})();

const router = new Router();
// router.addPath('/', ['GET'], (request, response) => {
//   const url = new URL(`${app.get_domain()}${request.url}`);
//   const params = url.searchParams;
//   const ans = [];
//   for (const [key, value] of params.entries()) {
//     ans.push(`Key: ${key}, Value: ${value}`);
//   }
//   ans.push('OK')
//   return ans.join('\n');
// });

router.addPath('/film', ['POST'], async (request, response) => {
  const { name, production_year, genres = [] } = JSON.parse(request.body);
  response.writeHead(201, {
    'Content-Type': 'application/json',
  });
  const res = await Film.create({
    name,
    production_year,
    genres,
  });
  const film_pk = res.dataValues.pk;
  // console.log(`film_pk: ${film_pk}`);
  genres.forEach(async (genreTitle) => {
    const genre = await Genre.findOne({
      attributes: ['pk'],
      where: {
        name: genreTitle,
      }
    });
    if (genre !== null) {
      const genre_pk = genre.dataValues.pk;
      // console.log(`genre_pk: ${genre_pk}`);
      // console.log(`film_pk: ${film_pk}`);
      await Film_Genre.create({
        film_id: film_pk, 
        genre_id: genre_pk,
      });
    } else {
      // TODO: вернуть в теле ответа массив несуществующих жанров
      console.log(`Genre: ${genreTitle} not exist!!!`);
    }
  });
  response.end(JSON.stringify({ status: 'Created', pk: film_pk }));
});

router.addPath('/film', ['GET'], async (request, response) => {
  // FIXME: change getting pk via:
  // const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
  // TODO: add attributes support via url params
  const res = await Film.findAll({
    include: { 
      model: Genre, 
      through: {
        attributes: [
          'film_id',
        ],
      }, 
    },
  });
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // console.log(res);
  response.end(JSON.stringify(res));
});

router.addPath('/film/<film_id:int>', ['GET'], async (request, response, params, parameters) => {
  const { film_id } = parameters;
  const res = await Film.findOne({
    where: {
      pk: film_id,
    }
  });
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // console.log(res);
  if (res === null) {
    response.end(JSON.stringify({ status: 'Film with pk 2 not exist!!!' }));
  } else {
    response.end(JSON.stringify(res));
  }
});

router.addPath('/film/<film_id:int>', ['PUT'], async (request, response, params, parameters) => {
  const { film_id } = parameters;
  const { name, production_year } = JSON.parse(request.body);
  const res = await Film.update({
    name,
    production_year,
  }, {
    where: {
      pk: film_id,
    }
  });
  response.writeHead(405, {
    'Content-Type': 'application/json',
  });
  if (res == 1) {
    response.end(JSON.stringify({ status: 'Updated' }));
  } else {
    response.end(JSON.stringify({ status: 'Film with pk 2 not exist!!!' }));
  }
});

router.addPath('/film/<film_id:int>', ['DELETE'], async (request, response, params, parameters) => {
  const { film_id } = parameters;
  const res = await Film.destroy({
    where: {
      pk: film_id,
    },
  });
  response.writeHead(405, {
    'Content-Type': 'application/json',
  });
  // console.log(res);
  if (res == 1) {
    response.end(JSON.stringify({ status: 'Deleted' }));
  } else {
    response.end(JSON.stringify({ status: 'Film with pk 2 not exist!!!' }));
  }
});

// Genres
router.addPath('/genre', ['POST'], async (request, response) => {
  const { name } = JSON.parse(request.body);
  response.writeHead(201, {
    'Content-Type': 'application/json',
  });
  const res = await Genre.create({
    name,
  });
  // console.log(res);
  response.end(JSON.stringify({ status: 'Created' }));
});

router.addPath('/genre', ['GET'], async (request, response) => {
  const res = await Genre.findAll({});
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // console.log(res);
  response.end(JSON.stringify(res));
});

router.addPath('/genre/<genre_id:int>', ['GET'], async (request, response, params, parameters) => {
  const { genre_id } = parameters;
  const res = await Genre.findOne({
    where: {
      pk: genre_id,
    }
  });
  response.writeHead(200, {
    'Content-Type': 'application/json',
  });
  // console.log(res);
  if (res === null) {
    response.end(JSON.stringify({ status: 'Genre with pk 2 not exist!!!' }));
  } else {
    response.end(JSON.stringify(res));
  }
});

router.addPath('/genre/<genre_id:int>', ['PUT'], async (request, response, params, parameters) => {
  const { genre_id } = parameters;
  const { name } = JSON.parse(request.body);
  const res = await Genre.update({
    name,
  }, {
    where: {
      pk: genre_id,
    }
  });
  response.writeHead(405, {
    'Content-Type': 'application/json',
  });
  if (res == 1) {
    response.end(JSON.stringify({ status: 'Updated' }));
  } else {
    response.end(JSON.stringify({ status: 'Genre with pk 2 not exist!!!' }));
  }
});

router.addPath('/genre/<genre_id:int>', ['DELETE'], async (request, response, params, parameters) => {
  const { genre_id } = parameters;
  const res = await Genre.destroy({
    where: {
      pk: genre_id,
    }
  });
  response.writeHead(405, {
    'Content-Type': 'application/json',
  });
  console.log(res);
  if (res == 1) {
    response.end(JSON.stringify({ status: 'Deleted' }));
  } else {
    response.end(JSON.stringify({ status: 'Genre with pk 2 not exist!!!' }));
  }
});

app.addRouter(router);
app.listen();
