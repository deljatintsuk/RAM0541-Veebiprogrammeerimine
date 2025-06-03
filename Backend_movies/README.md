# RAM0541 Veebiprogrammeerimine Movies Backend

Aleksander Deljatintšuk

## Description

A backend realization for reading movies database with working API

## Usage

1. Clone the repository.
2. Install dependencies (`npm install`).
3. Setup the postgres database 
4. Use .env file to configure database
```
DB_DATABASE=DATABASE_NAME
DB_USER=USER_NAME
DB_PASSWORD=USER_PASSWORD
DB_HOST=HOST_NAME
DB_PORT=HOST_PORT
DB_SCHEMA=DATABASE_SCHEMA
DB_DIALECT=postgres
SERVER_PORT=8080
```
5. Launch backend (`npx nodemon index.js`)
6. Use Swagger UI for checking available API (`127.0.0.1:8080/api-docs/`)
7. Swagger autogenerates API documentation every launch
