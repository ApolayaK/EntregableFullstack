const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Importar el pool de conexiones
const pool = require('./config/conexion');  // Ya no necesitas createConnection

// Rutas
const productosRoutes = require('./routes/productos');

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Usar el pool directamente para hacer pruebas de conexión
pool.getConnection()
  .then((connection) => {
    console.log('Conexión exitosa a la base de datos');
    connection.release(); // Liberamos la conexión después de la prueba

    // Registrar las rutas solo si la conexión es exitosa
    app.use('/', productosRoutes);  

    // Arrancar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo conectar a la base de datos:', err.message);
  });

// Middleware de error general
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocurrió un error interno');
});


app.use('/', productosRoutes);