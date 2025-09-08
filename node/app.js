// Importa los módulos necesarios
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer'); // Importa Multer

// Inicializa la aplicación Express
const app = express();
const port = 8000;

// Middleware para procesar JSON y datos de formularios.
// Es necesario para que Express pueda leer los datos enviados en los cuerpos de las peticiones POST y PUT.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura Multer para manejar datos de formulario sin archivos (multipart/form-data)
const upload = multer();

// Función de ayuda para obtener una conexión a la base de datos
function dbConnection() {
  // Crea o abre la base de datos 'students.sqlite'
  return new sqlite3.Database('./students.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

// Ruta principal para manejar las peticiones a '/students'
app.route('/students')
  .get((req, res) => {
    // Maneja la petición GET para obtener todos los estudiantes
    const db = dbConnection();
    const sql = "SELECT * FROM students";

    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
    // Cierra la conexión a la base de datos
    db.close();
  })
  // Middleware de Multer para manejar form-data
  .post(upload.none(), (req, res) => {
    // Maneja la petición POST para crear un nuevo estudiante
    const db = dbConnection();
    // La desestructuración de req.body ahora funcionará correctamente con form-data
    const { firstname, lastname, gender, age } = req.body;
    const sql = `INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)`;

    db.run(sql, [firstname, lastname, gender, age], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      // 'this.lastID' es la propiedad de sqlite3 para obtener el ID de la fila insertada
      res.send(`Student with id: ${this.lastID} created successfully`);
    });
    db.close();
  });

// Ruta para manejar peticiones a '/student/:id' (con un ID específico)
app.route('/student/:id')
  .get((req, res) => {
    // Maneja la petición GET para obtener un estudiante por ID
    const db = dbConnection();
    const sql = "SELECT * FROM students WHERE id=?";
    const id = req.params.id;

    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json(row);
    });
    db.close();
  })
  // Middleware de Multer para manejar form-data
  .put(upload.none(), (req, res) => {
    // Maneja la petición PUT para actualizar un estudiante por ID
    const db = dbConnection();
    const { firstname, lastname, gender, age } = req.body;
    const id = req.params.id;
    const sql = `UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`;

    db.run(sql, [firstname, lastname, gender, age, id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ id, firstname, lastname, gender, age });
    });
    db.close();
  })
  .delete((req, res) => {
    // Maneja la petición DELETE para eliminar un estudiante por ID
    const db = dbConnection();
    const id = req.params.id;
    const sql = `DELETE FROM students WHERE id=?`;

    db.run(sql, [id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.send(`The Student with id: ${id} has been deleted.`);
    });
    db.close();
  });

// Inicia el servidor Express
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
