require("dotenv").config();

module.exports = {
  port: process.env.PORT || 8080,
  db: {
    DATABASE: process.env.DB_DATABASE,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    DIALECT: process.env.DB_DIALECT,
    SCHEMA: process.env.DB_SCHEMA,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  },
  auth: {
    secret: process.env.JWT_SECRET,
  },
};
