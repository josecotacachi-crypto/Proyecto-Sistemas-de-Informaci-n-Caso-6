-- Habilitar el soporte para claves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- 1. Tabla de Zonas
-- Define las áreas geográficas de cobertura del delivery
CREATE TABLE IF NOT EXISTS zonas (
    id_zona INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

-- 2. Tabla de Clientes
-- Almacena la información básica de los usuarios
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    telefono TEXT,
    email TEXT UNIQUE
);

-- 3. Tabla de Pedidos
-- Centraliza la operación de delivery y las rutas
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    zona_id INTEGER NOT NULL,
    direccion_entrega TEXT NOT NULL,
    hora_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Estado de la entrega con restricción para asegurar valores válidos
    estado_entrega TEXT NOT NULL DEFAULT 'pendiente' 
        CHECK (estado_entrega IN ('pendiente', 'en camino', 'entregado', 'cancelado')),
    
    -- Campo para el algoritmo de optimización de rutas
    orden_ruta_sugerida INTEGER,

    -- Relaciones (Claves Foráneas)
    FOREIGN KEY (cliente_id) REFERENCES clientes (id_cliente) 
        ON DELETE CASCADE,
    FOREIGN KEY (zona_id) REFERENCES zonas (id_zona) 
        ON DELETE RESTRICT
);

-- Índices corregidos con IF NOT EXISTS para evitar el error SQLite
CREATE INDEX IF NOT EXISTS idx_pedidos_zona ON pedidos(zona_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado_entrega);

-- Insertar las zonas de ruta si no existen
INSERT OR IGNORE INTO zonas (id_zona, nombre, descripcion) VALUES 
(1, 'Norte', 'Ruta Zona Norte'),
(2, 'Centro', 'Ruta Zona Centro'),
(3, 'Sur', 'Ruta Zona Sur');

-- Insertar un cliente genérico de prueba si no existe
INSERT OR IGNORE INTO clientes (id_cliente, nombre, telefono, email) VALUES 
(1, 'Cliente General de Rutas', '+56912345678', 'contacto@rutasmatias.cl');

-- Insertar los 30 pedidos de prueba asignados a Matías
-- Se corrigieron los nombres de columnas y se añadió 'direccion_entrega'
INSERT INTO pedidos (cliente_id, zona_id, direccion_entrega) VALUES
-- Pedidos Zona Norte (zona_id = 1)
(1, 1, 'Dirección Norte 1'), (1, 1, 'Dirección Norte 2'), (1, 1, 'Dirección Norte 3'), (1, 1, 'Dirección Norte 4'), (1, 1, 'Dirección Norte 5'),
(1, 1, 'Dirección Norte 6'), (1, 1, 'Dirección Norte 7'), (1, 1, 'Dirección Norte 8'), (1, 1, 'Dirección Norte 9'), (1, 1, 'Dirección Norte 10'),

-- Pedidos Zona Centro (zona_id = 2)
(1, 2, 'Dirección Centro 1'), (1, 2, 'Dirección Centro 2'), (1, 2, 'Dirección Centro 3'), (1, 2, 'Dirección Centro 4'), (1, 2, 'Dirección Centro 5'),
(1, 2, 'Dirección Centro 6'), (1, 2, 'Dirección Centro 7'), (1, 2, 'Dirección Centro 8'), (1, 2, 'Dirección Centro 9'), (1, 2, 'Dirección Centro 10'),

-- Pedidos Zona Sur (zona_id = 3)
(1, 3, 'Dirección Sur 1'), (1, 3, 'Dirección Sur 2'), (1, 3, 'Dirección Sur 3'), (1, 3, 'Dirección Sur 4'), (1, 3, 'Dirección Sur 5'),
(1, 3, 'Dirección Sur 6'), (1, 3, 'Dirección Sur 7'), (1, 3, 'Dirección Sur 8'), (1, 3, 'Dirección Sur 9'), (1, 3, 'Dirección Sur 10');