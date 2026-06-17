-- ==========================================
-- 1. ESTRUCTURA REAL DE LA TABLA (DDL)
-- ==========================================
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    zona_id INTEGER NOT NULL, -- 1: Norte, 2: Centro, 3: Sur
    direccion_entrega TEXT NOT NULL,
    hora_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_entrega TEXT DEFAULT 'pendiente',
    orden_ruta_sugerida INTEGER
);

-- ========================================== 
-- 2. CARGA DE REGISTROS DE EJEMPLO (DML)
-- ==========================================
INSERT INTO pedidos (cliente_id, zona_id, direccion_entrega, estado_entrega, orden_ruta_sugerida) VALUES
(101, 1, 'Av. Costanera 1200, Coquimbo', 'pendiente', 1),
(102, 1, 'Calle Regimiento 450, Coquimbo', 'pendiente', 2),
(201, 2, 'Aldunate 340, Centro Coquimbo', 'pendiente', 1),
(202, 2, 'Melgarejo 780, Centro Coquimbo', 'pendiente', 2),
(301, 3, 'Av. El Sauce 4500, Sindempart', 'pendiente', 1),
(302, 3, 'Los Clarines 230, Sindempart', 'pendiente', 2); 