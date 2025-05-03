const pool = require('../config/conexion');
const multer = require('../config/multer'); // Si estás usando Multer para subir imágenes


// Listar productos
exports.listarProductos = async (req, res) => {
    try {
        const [productos] = await pool.query(`
        SELECT id, producto, descripcion, precio, imagen, talla, color, cantidad
        FROM productos
      `);
        res.render('admin', { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar los productos');
    }
};

// Formulario de creación de producto
exports.formularioCrear = (req, res) => {
    res.render('create');
};

// Crear producto
exports.crearProducto = async (req, res) => {
    try {
        const { producto, descripcion, precio, talla, color, cantidad } = req.body;
        const imagen = req.file ? req.file.filename : null;

        if (!producto || !descripcion || !precio) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        await pool.query(
            "INSERT INTO productos (producto, descripcion, precio, talla, color, cantidad, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [producto, descripcion, precio, talla, color, cantidad, imagen]
        );

        res.redirect('/admin'); // Redirige a la vista de administración
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el producto');
    }
};

// Formulario de edición de producto
exports.formularioEditar = async (req, res) => {
    try {
        const [producto] = await pool.query("SELECT * FROM productos WHERE id = ?", [req.params.id]);

        if (producto.length > 0) {
            res.render('edit', { producto: producto[0] });
        } else {
            res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el producto');
    }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
    try {
        const { producto, descripcion, precio, talla, color, cantidad, imagenActual } = req.body;
        let imagen = req.file ? req.file.filename : imagenActual;

        if (!producto || !descripcion || !precio || !talla || !color || !cantidad) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        await pool.query(
            `UPDATE productos 
   SET producto = ?, descripcion = ?, precio = ?, talla = ?, color = ?, cantidad = ?, imagen = ?
   WHERE id = ?`,
            [producto, descripcion, precio, talla, color, cantidad, imagen, req.params.id]
        );
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar el producto');
    }
};


const fs = require('fs');
const path = require('path');

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  try {
    const id = req.params.id;

    // 1) Recuperar nombre de la imagen (para borrarla del disco)
    const [rows] = await pool.query(
      "SELECT imagen FROM productos WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.redirect('/admin');
    }
    const nombreImagen = rows[0].imagen;

    // 2) Borrar registro de la base de datos
    await pool.query("DELETE FROM productos WHERE id = ?", [id]);

    // 3) (Opcional) Borrar la imagen física
    if (nombreImagen) {
      const rutaImagen = path.join(__dirname, '../public/uploads/', nombreImagen);
      fs.unlink(rutaImagen, err => {
        if (err) console.warn('No se pudo borrar la imagen:', err);
      });
    }

    // 4) Volver al panel de admin
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el producto');
  }
};

// Listar productos para catálogo público
exports.catalogoProductos = async (req, res) => {
  try {
    const [productos] = await pool.query(`
      SELECT id, producto, descripcion, precio, imagen, talla, color, cantidad
      FROM productos
    `);
    res.render('catalogo', { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el catálogo');
  }
};
