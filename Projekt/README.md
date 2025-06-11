# RAM0541 Practice - Project - Digital Goods Platform
By Aleksandr Bondarev

## Description
The copy of platform of selling digital goods inspired by G2A, plati.ru and okidoki.ee 

## Usage

1. Clone the repository.
2. Install dependencies (`npm install`).
3. Use [SQL backup](https://github.com/Hirolane/ram0541_practice/blob/main/Projekt/setup/Schema%20Backup.sql) for schema recreating on your db
4. Configure your .env file in root folder Projekt
   Use following template:
```
#DATABASE
DB_DATABASE=db_name
DB_USER=user123
DB_PASSWORD=qwerty

DB_HOST=host.name.com
DB_PORT=5432

DB_SCHEMA=okidoki
DB_DIALECT=postgres

#SERVER_PORT
SERVER_PORT=3000

#TOKEN
TOKEN_SECRET='token_abc'
# Generate random token by using token generator site like https://it-tools.tech/token-generator
```
6. Launch the server (`npx nodemon index.js`)
7. Open `http://localhost:port/api-docs/`
