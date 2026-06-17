const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(cors());

// 1. Conectar con la base de datos (Tu ruta exacta que ya funciona)
const dbPath = path.join(__dirname, '../db/matias');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado con éxito a la base de datos SQLite real.');
    }
});

// 2. Ruta Original: Entrega la lista plana de todos los pedidos
app.get('/api/pedidos', (req, res) => {
    console.log('--> Consultando lista plana de pedidos...');
    const sql = 'SELECT * FROM pedidos';
    
    db.all(sql, [], (err, filas) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            mensaje: "Pedidos recuperados con éxito",
            datos: filas
        });
    });
});

// 3. NUEVA RUTA: Lógica de negocio organizada por zonas (NotebookLM)
app.get('/api/ruta-optimizada', (req, res) => {
    console.log('--> ¡Calculando la ruta inteligente por zonas!');
    
    // Consulta SQL: Solo toma los 'pendiente' y los ordena por zona
    const sql = `
        SELECT * FROM pedidos 
        WHERE estado_entrega = 'pendiente' 
        ORDER BY zona_id ASC, id_pedido ASC
    `;
    
    db.all(sql, [], (err, filas) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Cajas vacías para clasificar los sectores de la ciudad
        const rutaPorZonas = {
            Norte: [],
            Centro: [],
            Sur: []
        };

        // Guardar cada pedido en su sector correspondiente
        filas.forEach(pedido => {
            if (pedido.zona_id === 1) {
                rutaPorZonas.Norte.push(pedido);
            } else if (pedido.zona_id === 2) {
                rutaPorZonas.Centro.push(pedido);
            } else if (pedido.zona_id === 3) {
                rutaPorZonas.Sur.push(pedido);
            }
        });

        // Entregar los datos ordenados
        res.json({
            mensaje: "Ruta del día optimizada por sectores",
            total_pendientes: filas.length,
            zonas: rutaPorZonas
        });
    });
});

// 4. Encender el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo y escuchando en el puerto ${PORT}`);
    console.log(`Link de siempre: http://localhost:3000/api/pedidos`);
    console.log(`Link nuevo por zonas: http://localhost:3000/api/ruta-optimizada`);
});