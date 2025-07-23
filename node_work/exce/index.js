const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cw19970904',
    database: 'mymovies'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/movies', (req, res) => {
    db.query('SELECT * FROM movies', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

app.put('/movies/:id', (req, res) => {
    const id = req.params.id;
    const { title, director } = req.body;
    if (!title || !director) {
        return res.status(400).json({ error: 'Title and director are required' });
    }

    db.query('UPDATE movies SET title = ?, director = ? WHERE id = ?', [title, director, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database update failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ id, title, director });
    });
});

app.post('/movies', (req, res) => {
    const { title, director } = req.body;
    if (!title || !director) {
        return res.status(400).json({ error: 'Title and director are required' });
    }

    db.query('INSERT INTO movies (title, director) VALUES (?, ?)', [title, director], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database insert failed' });
        }
        res.status(201).json({ id: results.insertId, title, director });
    });
});

app.delete('/movies/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM movies WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database delete failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(204).send(); // No content
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})