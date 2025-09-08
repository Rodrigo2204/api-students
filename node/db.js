// Importa el módulo sqlite3
const sqlite3 = require('sqlite3').verbose();

// Crea o abre la conexión a la base de datos.
// El archivo 'students.sqlite' se creará si no existe.
const db = new sqlite3.Database('./students.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conexión exitosa a la base de datos students.sqlite.');
  }
});

// Define la consulta SQL para crear la tabla students
const sql_query = `CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  gender TEXT NOT NULL,
  age TEXT
)`;

// Ejecuta la consulta SQL
db.run(sql_query, (err) => {
  if (err) {
    console.error('Error al crear la tabla:', err.message);
  } else {
    console.log('La tabla "students" ha sido creada o ya existe.');
  }
});

// Cierra la conexión a la base de datos
db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conexión a la base de datos cerrada.');
  }
});
