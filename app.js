const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (como tu archivo home.html)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir el home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));  // Ruta al archivo home.html
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
