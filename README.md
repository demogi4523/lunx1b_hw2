# lunx1b_hw2

## Postman public workspace for testing

https://www.postman.com/supply-administrator-50403692/workspace/pgn/overview

## Postgres docker useful commands

```
> docker run --name pgn -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres

> docker exec -it pgn /bin/bash
pg_docker_container> psql -U postgres

> docker stop pgn
> docker rm pgn
```

## Psql inside postgres docker container usuful commands
```
> SELECT * FROM film;
> DROP TABLE film CASCADE;

> SELECT * FROM genre;
> DROP TABLE genre CASCADE;

> SELECT * FROM film_genre;
> DROP TABLE film_genre CASCADE;
```
