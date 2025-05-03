const mysql = require('mysql2/promise');

// Crear pool de acceso
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'tiendaonline'
});

module.exports = pool;
