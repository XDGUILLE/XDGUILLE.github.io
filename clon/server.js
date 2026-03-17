const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexión MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // CAMBIAR POR TU USUARIO
    password: '123456',           // CAMBIAR POR TU PASSWORD
    database: 'NetflixDB'
});

// Conectar
connection.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a NetflixDB');
});

// RUTA 1: Obtener todas las series
app.get('/api/series', (req, res) => {
    const query = 'SELECT * FROM Series ORDER BY titulo';
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Error al obtener series' });
            return;
        }
        res.json(results);
    });
});

// RUTA 2: Obtener una serie con episodios
app.get('/api/series/:id', (req, res) => {
    const serieId = req.params.id;
    const query = `
        SELECT s.*, 
            e.episodio_id, e.titulo as episodio_titulo, 
            e.duracion, e.rating_imdb, e.temporada, 
            e.descripcion as episodio_descripcion, e.fecha_estreno
        FROM Series s
        LEFT JOIN Episodios e ON s.serie_id = e.serie_id
        WHERE s.serie_id = ?
        ORDER BY e.temporada, e.episodio_id
    `;
    
    connection.query(query, [serieId], (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Error al obtener serie' });
            return;
        }
        res.json(results);
    });
});

// RUTA 3: Obtener actores de una serie
app.get('/api/series/:id/actores', (req, res) => {
    const serieId = req.params.id;
    const query = `
        SELECT a.actor_id, a.nombre, a.fecha_nacimiento, ac.personaje
        FROM Actores a
        INNER JOIN Actuaciones ac ON a.actor_id = ac.actor_id
        WHERE ac.serie_id = ?
        ORDER BY a.nombre
    `;
    
    connection.query(query, [serieId], (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Error al obtener actores' });
            return;
        }
        res.json(results);
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});