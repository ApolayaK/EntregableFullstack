// ─── Importación de Módulos ────────
const express    = require('express');
const path       = require('path');
const multer     = require('multer');
const connection = require('./config/conexion'); 

const app        = express();
const PORT       = 3000;

// ─── Configuración del Motor de Plantillas (EJS) ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Middlewares ─────
app.use(express.urlencoded({ extended: false })); // Para leer formularios
app.use(express.static(path.join(__dirname, 'public'))); // Archivos estáticos


// ─── Configuración de Multer (Subida de imágenes) ─────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); 
  }
});
const upload = multer({ storage });

// ─── Rutas ────

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Formulario para crear productos
app.get('/create', (req, res) => {
  res.render('create'); 
});

// Procesar formulario de creación
app.post('/crear', upload.single('imagen'), (req, res) => {
  const datos = {
    producto:    req.body.producto,
    descripcion: req.body.descripcion,
    precio:      req.body.precio,
    talla:       req.body.talla,
    color:       req.body.color,
    cantidad:    req.body.cantidad,
    imagen:      req.file ? req.file.filename : null
  };

  connection.query('INSERT INTO productos SET ?', datos, (err, result) => {
    if (err) {
      console.error('Error al insertar producto:', err);
      return res.status(500).send('Error al guardar en la base de datos');
    }
    res.redirect('/admin'); 
  });
});

// Mostrar lista de productos registrados
app.get('/admin', (req, res) => {
  connection.query('SELECT * FROM productos', (err, productos) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.send('Error al leer productos');
    }
    res.render('admin', { productos }); 
  });
});

// Otras vistas opcionales
app.get('/catalogo', (req, res) => res.render('catalogo'));
app.get('/edit',     (req, res) => res.render('edit'));

// ─── Iniciar Servidor ────
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
