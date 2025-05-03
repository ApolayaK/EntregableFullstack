const express = require('express');
const router = express.Router();
const productosCtrl = require('../controllers/productosController');
const upload = require('../config/multer');  // Importar la configuración de Multer

// Ruta para la página principal
router.get('/', (req, res) => {
  res.render('home');  // Asegúrate de que 'home' es el nombre correcto de tu archivo .ejs
});

// Crear
router.get('/create', productosCtrl.formularioCrear);
router.post('/create', upload.single('imagen'), productosCtrl.crearProducto);  // Usar Multer en la ruta POST

// Editar
router.get('/edit/:id', productosCtrl.formularioEditar);
router.post('/edit/:id', upload.single('imagen'), productosCtrl.actualizarProducto);  // Usar Multer en la ruta POST

router.get('/admin', productosCtrl.listarProductos);

// Ruta para eliminar (puede ser GET o, mejor, POST)
router.get('/delete/:id', productosCtrl.eliminarProducto);
router.post('/delete/:id', productosCtrl.eliminarProducto);

// Ruta para ver el catálogo público
router.get('/catalogo', productosCtrl.catalogoProductos);



module.exports = router;
