const Database = require('better-sqlite3');
const dotenv = require('dotenv');
dotenv.config();

const db = new Database(process.env.DB_PATH || ':memory:');

module.exports = db;
