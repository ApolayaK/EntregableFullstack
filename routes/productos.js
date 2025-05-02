const express = require('express'); 
const router = express.Router(); 
const db = require('../config/conexion'); 

// Ruta principal que lista los productos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT
        P.idproducto,
        P.nombre,
        P.descripcion,
        P.precio,
        P.imagen,
        C.categoria
      FROM productos P
      INNER JOIN categorias C ON P.idcategoria = C.idcategoria
    `;
    const [productos] = await db.query(query);
    res.render('productos/index', { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los productos');
  }
});

// Ruta para acceder a la vista de CREACIÓN de productos
router.get('/create', async (req, res) => {
  try {
    const [categorias] = await db.query("SELECT * FROM categorias");
    res.render('productos/create', { categorias });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar las categorías');
  }
});

// Ruta para almacenar un nuevo producto
router.post('/create', async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen } = req.body;
    await db.query(
      "INSERT INTO productos (nombre, descripcion, precio, idcategoria, imagen) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, categoria, imagen]
    );
    res.redirect('/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el producto');
  }
});

// Ruta para editar un producto
router.get('/edit/:id', async (req, res) => {
  try {
    const [categorias] = await db.query("SELECT * FROM categorias");
    const [producto] = await db.query("SELECT * FROM productos WHERE idproducto = ?", [req.params.id]);

    if (producto.length > 0) {
      res.render('productos/edit', { categorias, producto: producto[0] });
    } else {
      res.redirect('/productos');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el producto');
  }
});

// Ruta para actualizar los datos de un producto
router.post('/edit/:id', async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen } = req.body;
    await db.query(
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, idcategoria = ?, imagen = ? WHERE idproducto = ?",
      [nombre, descripcion, precio, categoria, imagen, req.params.id]
    );
    res.redirect('/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el producto');
  }
});

// Ruta para eliminar un producto
router.get('/delete/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM productos WHERE idproducto = ?", [req.params.id]);
    res.redirect('/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
});

module.exports = router;
