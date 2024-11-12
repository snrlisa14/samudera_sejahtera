const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Database configuration

// Lihat semua nelayan
router.get('/view', (req, res) => {
    const query = "SELECT * FROM nelayan WHERE user_id = ?";
    db.query(query, [req.session.user.id], (err, results) => {
        if (err) throw err;
        res.render('view', { nelayan: results });
    });
});

// Tambah nelayan baru - Formulir tambah nelayan
router.get('/add', (req, res) => {
    res.render('add');
});

// Proses tambah nelayan baru
router.post('/add', (req, res) => {
    const { nama, alamat } = req.body;
    const query = "INSERT INTO nelayan (nama, alamat, user_id) VALUES (?, ?, ?)";
    db.query(query, [nama, alamat, req.session.user.id], (err, result) => {
        if (err) throw err;
        res.redirect('/nelayan/view');
    });
});

// Edit nelayan - Formulir edit nelayan
router.get('/edit/:id', (req, res) => {
    const query = "SELECT * FROM nelayan WHERE id = ?";
    db.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('edit', { nelayan: results[0] });
    });
});

// Proses edit nelayan
router.post('/edit/:id', (req, res) => {
    const { nama, alamat } = req.body;
    const query = "UPDATE nelayan SET nama = ?, alamat = ? WHERE id = ?";
    db.query(query, [nama, alamat, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/nelayan/view');
    });
});

// Hapus nelayan
router.get('/delete/:id', (req, res) => {
    const query = "DELETE FROM nelayan WHERE id = ?";
    db.query(query, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/nelayan/view');
    });
});

module.exports = router;
