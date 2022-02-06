const mysql = require("mysql2");
require("dotenv").config();

const base = mysql.createConnection(
  {
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log("connected to employee database.")
);

module.exports = base;
