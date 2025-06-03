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

Authorisation

username: admin
password: 123456

After login then comes token. Using this token must be with Bearer as a title for example ![image](https://github.com/user-attachments/assets/c32441fa-4ce2-4a71-8708-4bcda07c0552)


![image](https://github.com/user-attachments/assets/56124702-2c83-493c-8d75-25b48d937f08)

