# lunx1b_hw2

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
```
