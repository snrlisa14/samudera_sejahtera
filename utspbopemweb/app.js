const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const nelayanRoutes = require('./routes/nelayan');
const path = require('path');
const Connection = require('./config/db'); // Memastikan koneksi database diimpor dengan benar
const app = express();

// Set EJS sebagai template engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check login status
app.use((req, res, next) => {
  if (!req.session.user && req.path !== '/auth/login' && req.path !== '/auth/register') {
    return res.redirect('/auth/login');
  } else if (req.session.user && req.path === '/') {
    return res.redirect('/auth/profile');
  }
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/nelayan', nelayanRoutes);

// Root Route: Redirect to /auth/login or /auth/profile based on session
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/auth/profile');
  } else {
    return res.redirect('/auth/login');
  }
});

// READ: Tampilkan semua aktivitas
app.get('/view', (req, res) => {
  const query = 'SELECT * FROM nelayan';
  Connection.query(query, (err, results) => {
      if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
      } else {
          res.render('view', {nelayan: results });
      }
  });
});

// CREATE: Tampilkan form untuk menambahkan aktivitas
app.get('/add', (req, res) => {
  res.render('add');
});

// CREATE: Menyimpan aktivitas baru
app.post('/nelayan/add:id', (req, res) => {
  const { nama, alamat } = req.body;
  const query = 'INSERT INTO nelayan (nama, alamat) VALUES (?, ?)';
  Connection.query(query, [nama, alamat], (err, results) => {
    if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
      } else {
          res.redirect('/view');
      }
  });
});

app.post('/add', (req, res) => {
  const { nama, alamat } = req.body;
  const query = 'INSERT INTO nelayan (nama, alamat) VALUES (?, ?)';
  Connection.query(query, [nama, alamat], (err, results) => {
      if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
      } else {
          res.redirect('/view');
      }
  });
});
// EDIT: Tampilkan form untuk mengedit aktivitas berdasarkan ID
app.get('/nelayan/edit/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM nelayan WHERE id = ?';
  Connection.query(query, [id], (err, results) => {
      if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
      } else if (results.length === 0) {
          res.status(404).send("Nelayan not found");
      } else {
          res.render('edit', { nelayan: results[0] });
      }
  });
});
app.post('/edit', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM nelayan WHERE id = ?';
  Connection.query(query, [id], (err, results) => {
      if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
      } else if (results.length === 0) {
          res.status(404).send("Nelayan not found");
      } else {
          res.render('edit', { nelayan: results[0] });
      }
  });
});
// DELETE: Menghapus aktivitas berdasarkan ID
app.post('/nelayan/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM nelayan WHERE id = ?';
  Connection.query(query, [id], (err, results) => {
      if (err) {
          console.error("Error executing query:", err);
          res.status(500).send("Internal Server Error");
      } else {
          res.redirect('/view');
      }
  });
});

// Menjalankan Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
