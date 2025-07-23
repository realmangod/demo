const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cw19970904',
    database: 'myapp'
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

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

app.post('/users', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    db.query('INSERT INTO users (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database insert failed' });
        }
        res.status(201).json({ id: results.insertId, name });
    });
});

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.query('UPDATE users SET name = ? WHERE id = ?', [name, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database update failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id, name });
    });
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database delete failed' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).json({ message: 'User deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

