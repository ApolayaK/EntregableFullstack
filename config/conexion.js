const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',      
  user: 'root',          
  password: '',           
  database: 'tiendaonline'
});

// Conectar a la bd
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL como id ' + connection.threadId);
});

// Exportamos la conexión 
module.exports = connection;