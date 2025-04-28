const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos (imágenes, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para mostrar home.html (aunque esté fuera de /public)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/index', (req, res) => {
  res.render('index'); // Renderiza views/index.ejs
});


// Ruta para el catálogo (catalogo.ejs)
app.get('/catalogo', (req, res) => {
  const productos = [
    { id: 1, nombre: 'Zapato Deportivo', precio: 39.99, categoria: 'deportivo', imagen: 'zapato1.jpg' },
    { id: 2, nombre: 'Bota de Invierno', precio: 89.99, categoria: 'botas', imagen: 'bota1.jpg' },
    { id: 3, nombre: 'Zapato Casual', precio: 59.99, categoria: 'casual', imagen: 'zapato2.jpg' }
  ];
  res.render('catalogo', { productos });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
