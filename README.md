# Takenos Challenge v1.0.1

This is an API whose functionality is to insert information through a CSV file. From this information, certain data analyses are derived, which can be consulted at any time.

Deploy URL: https://takenos-challenge.onrender.com


## Endpoints

In the root of the repository, there is a file called 'routes-documentations.json' in which all the routes are rendered with their different options.

### Register
```
http://takenos-challenge.onrender.com/api/register
```
This endpoint will register a user with body params:

{
	email,
	password
}

### Login
```
http://takenos-challenge.onrender.com/api/login
```
This endpoint will login a user with body params:

{
	email,
	password
}

then, this return a bearer token to access in the other endpoints of the API.

### Upload

```
http://takenos-challenge.onrender.com/api/upload
```


### Data
```
http://takenos-challenge.onrender.com/api/transactions/total-volume
```

```
http://takenos-challenge.onrender.com/api/transactions/fraudulent
```

```
http://takenos-challenge.onrender.com/api/transactions/top-merchants
```


## Run project
- Install dependencies
```
npm install
```

then, execute a build command:
```
npm build
```

Create a new file .env and configure:
```
NODE_ENV
SERVER_PORT
JWT_SECRET
JWT_TOKEN_EXPIRATION
JWT_ISSUER
POSTGRESQL_DB
POSTGRESQL_USER
POSTGRESQL_PASSWORD
POSTGRESQL_PORT
POSTGRESQL_HOST
SMTP_MAIL_HOST
SMTP_MAIL_USER
SMTP_MAIL_PASS
SMTP_MAIL_SECURE
MAIL_FROM
```

- Run builded mode
```
npm run builded-start
```

### Run tests code with docker

```
npm run test-lint
```

### Run tests code with docker

```
docker build -t "testbuild" . && docker run -e POSTGRES_USER=test -e POSTGRES_DB=takenosTest -e POSTGRES_PASSWORD=testing --name database -d postgres:15.4-alpine3.18 && docker run --name=test --link=database:database --env-file .env.test testbuild npm run builded-test-mocha; docker rm test; docker rm -f database;
```
