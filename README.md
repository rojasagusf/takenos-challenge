# Takenos Challenge

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

- Run with typescript
```
npm start
```

- Run builded mode
```
npm run builded-start
```

### Run tests with docker

```
docker build -t "testbuild" . && docker run -e POSTGRES_USER=test -e POSTGRES_DB=takenosTest -e POSTGRES_PASSWORD=testing --name database -d postgres:15.4-alpine3.18 && docker run --name=test --link=database:database --env-file .env.test testbuild npm run builded-test-mocha; docker rm test; docker rm -f database;
```
