-- ============================================================================
-- IDP ERP - DATABASE SCHEMA
-- Sistema de gestión empresarial para constructora
-- ============================================================================

-- MÓDULO: CATÁLOGOS BASE
-- ============================================================================

-- Tabla: obras
-- Catálogo de proyectos/obras de construcción
CREATE TABLE obras (
    obra_id VARCHAR(50) PRIMARY KEY,
    codigo_obra VARCHAR(20) UNIQUE NOT NULL,
    nombre_obra VARCHAR(200) NOT NULL,
    cliente VARCHAR(200) NOT NULL,
    residente VARCHAR(100),
    direccion TEXT,
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    presupuesto_total DECIMAL(15,2) DEFAULT 0,
    estatus VARCHAR(20) DEFAULT 'activa' CHECK (estatus IN ('activa', 'pausada', 'terminada', 'cancelada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_obras_codigo ON obras(codigo_obra);
CREATE INDEX idx_obras_estatus ON obras(estatus);

-- Tabla: proveedores
-- Catálogo de proveedores
CREATE TABLE proveedores (
    proveedor_id VARCHAR(50) PRIMARY KEY,
    alias_proveedor VARCHAR(50) UNIQUE NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    rfc VARCHAR(13) UNIQUE NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    telefono VARCHAR(20),
    email VARCHAR(100),
    contacto_principal VARCHAR(100),
    banco VARCHAR(100),
    numero_cuenta VARCHAR(50),
    clabe VARCHAR(18),
    tipo_proveedor VARCHAR(20) CHECK (tipo_proveedor IN ('material', 'servicio', 'renta', 'mixto')),
    dias_credito INTEGER DEFAULT 0,
    limite_credito DECIMAL(15,2) DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_proveedores_alias ON proveedores(alias_proveedor);
CREATE INDEX idx_proveedores_activo ON proveedores(activo);

-- MÓDULO: REQUISICIONES
-- ============================================================================

-- Tabla: requisiciones_material
-- Solicitudes de material de residentes de obra
CREATE TABLE requisiciones_material (
    requisicion_id VARCHAR(50) PRIMARY KEY,
    numero_requisicion VARCHAR(50) UNIQUE NOT NULL,
    obra_id VARCHAR(50) NOT NULL REFERENCES obras(obra_id),
    residente_nombre VARCHAR(100) NOT NULL,
    fecha_creacion DATE NOT NULL,
    fecha_entrega_requerida DATE,
    urgencia VARCHAR(20) DEFAULT 'normal' CHECK (urgencia IN ('urgente', 'normal', 'planeado')),
    estatus VARCHAR(30) DEFAULT 'pendiente' CHECK (estatus IN ('pendiente', 'en_revision', 'aprobada', 'rechazada', 'convertida_oc')),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_requisiciones_obra ON requisiciones_material(obra_id);
CREATE INDEX idx_requisiciones_estatus ON requisiciones_material(estatus);
CREATE INDEX idx_requisiciones_urgencia ON requisiciones_material(urgencia);

-- Tabla: requisiciones_material_items
-- Ítems/conceptos de cada requisición
CREATE TABLE requisiciones_material_items (
    item_id VARCHAR(50) PRIMARY KEY,
    requisicion_id VARCHAR(50) NOT NULL REFERENCES requisiciones_material(requisicion_id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    orden_item INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_req_items_requisicion ON requisiciones_material_items(requisicion_id);

-- Tabla: requisiciones_comentarios
-- Comentarios/conversaciones en requisiciones
CREATE TABLE requisiciones_comentarios (
    comentario_id VARCHAR(50) PRIMARY KEY,
    requisicion_id VARCHAR(50) NOT NULL REFERENCES requisiciones_material(requisicion_id) ON DELETE CASCADE,
    autor VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_req_comentarios_requisicion ON requisiciones_comentarios(requisicion_id);

-- MÓDULO: ÓRDENES DE COMPRA
-- ============================================================================

-- Tabla: ordenes_compra
-- Órdenes de compra emitidas
CREATE TABLE ordenes_compra (
    oc_id VARCHAR(50) PRIMARY KEY,
    numero_oc VARCHAR(50) UNIQUE NOT NULL,
    obra_id VARCHAR(50) NOT NULL REFERENCES obras(obra_id),
    proveedor_id VARCHAR(50) NOT NULL REFERENCES proveedores(proveedor_id),
    comprador VARCHAR(100) NOT NULL,
    fecha_creacion DATE NOT NULL,
    fecha_entrega DATE NOT NULL,
    tipo_entrega VARCHAR(20) DEFAULT 'entrega' CHECK (tipo_entrega IN ('entrega', 'recoleccion')),
    aplica_iva BOOLEAN DEFAULT true,
    porcentaje_descuento DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    monto_descuento DECIMAL(15,2) DEFAULT 0,
    iva DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,
    observaciones TEXT,
    estatus VARCHAR(30) DEFAULT 'pendiente' CHECK (estatus IN ('pendiente', 'aprobada', 'rechazada', 'entregada', 'cancelada')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_oc_obra ON ordenes_compra(obra_id);
CREATE INDEX idx_oc_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_oc_estatus ON ordenes_compra(estatus);
CREATE INDEX idx_oc_fecha_creacion ON ordenes_compra(fecha_creacion);

-- Tabla: ordenes_compra_items
-- Ítems/partidas de cada orden de compra
CREATE TABLE ordenes_compra_items (
    item_id VARCHAR(50) PRIMARY KEY,
    oc_id VARCHAR(50) NOT NULL REFERENCES ordenes_compra(oc_id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    unidad VARCHAR(20) DEFAULT 'PZA',
    precio_unitario DECIMAL(12,2) NOT NULL,
    subtotal_item DECIMAL(15,2) NOT NULL,
    orden_item INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_oc_items_oc ON ordenes_compra_items(oc_id);

-- MÓDULO: PAGOS
-- ============================================================================

-- Tabla: pagos
-- Registro de pagos realizados a proveedores
CREATE TABLE pagos (
    pago_id VARCHAR(50) PRIMARY KEY,
    oc_id VARCHAR(50) NOT NULL REFERENCES ordenes_compra(oc_id),
    obra_id VARCHAR(50) NOT NULL REFERENCES obras(obra_id),
    proveedor_id VARCHAR(50) NOT NULL REFERENCES proveedores(proveedor_id),
    numero_pago VARCHAR(50) UNIQUE NOT NULL,
    fecha_pago DATE NOT NULL,
    monto_pagado DECIMAL(15,2) NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'transferencia' CHECK (metodo_pago IN ('transferencia', 'cheque', 'efectivo', 'tarjeta')),
    referencia_pago VARCHAR(100),
    banco VARCHAR(100),
    factura_numero VARCHAR(50),
    factura_xml_url TEXT,
    factura_pdf_url TEXT,
    notas TEXT,
    estatus VARCHAR(30) DEFAULT 'aplicado' CHECK (estatus IN ('pendiente', 'aplicado', 'cancelado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pagos_oc ON pagos(oc_id);
CREATE INDEX idx_pagos_obra ON pagos(obra_id);
CREATE INDEX idx_pagos_proveedor ON pagos(proveedor_id);
CREATE INDEX idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX idx_pagos_estatus ON pagos(estatus);

-- MÓDULO: ENTREGAS (FUTURO)
-- ============================================================================

-- Tabla: entregas
-- Registro de entregas de material
CREATE TABLE entregas (
    entrega_id VARCHAR(50) PRIMARY KEY,
    oc_id VARCHAR(50) NOT NULL REFERENCES ordenes_compra(oc_id),
    obra_id VARCHAR(50) NOT NULL REFERENCES obras(obra_id),
    numero_entrega VARCHAR(50) UNIQUE NOT NULL,
    fecha_entrega DATE NOT NULL,
    quien_recibe VARCHAR(100),
    observaciones TEXT,
    estatus VARCHAR(30) DEFAULT 'completa' CHECK (estatus IN ('parcial', 'completa', 'con_incidencia')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entregas_oc ON entregas(oc_id);
CREATE INDEX idx_entregas_obra ON entregas(obra_id);
CREATE INDEX idx_entregas_fecha ON entregas(fecha_entrega);

-- Tabla: entregas_items
-- Detalle de ítems entregados
CREATE TABLE entregas_items (
    entrega_item_id VARCHAR(50) PRIMARY KEY,
    entrega_id VARCHAR(50) NOT NULL REFERENCES entregas(entrega_id) ON DELETE CASCADE,
    oc_item_id VARCHAR(50) NOT NULL REFERENCES ordenes_compra_items(item_id),
    cantidad_entregada DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entregas_items_entrega ON entregas_items(entrega_id);
CREATE INDEX idx_entregas_items_oc_item ON entregas_items(oc_item_id);

-- ============================================================================
-- VISTAS ÚTILES PARA MÉTRICAS
-- ============================================================================

-- Vista: metricas_obra
-- Consolidado de métricas por obra (comprometido, pagado, saldo)
CREATE OR REPLACE VIEW metricas_obra AS
SELECT 
    o.obra_id,
    o.codigo_obra,
    o.nombre_obra,
    o.presupuesto_total,
    COALESCE(SUM(oc.total), 0) as total_comprometido,
    COALESCE(SUM(p.monto_pagado), 0) as total_pagado,
    o.presupuesto_total - COALESCE(SUM(oc.total), 0) as presupuesto_disponible,
    COALESCE(SUM(oc.total), 0) - COALESCE(SUM(p.monto_pagado), 0) as saldo_por_pagar
FROM obras o
LEFT JOIN ordenes_compra oc ON o.obra_id = oc.obra_id AND oc.estatus IN ('aprobada', 'entregada')
LEFT JOIN pagos p ON o.obra_id = p.obra_id AND p.estatus = 'aplicado'
GROUP BY o.obra_id, o.codigo_obra, o.nombre_obra, o.presupuesto_total;

-- Vista: resumen_oc_por_proveedor
-- Total comprometido por proveedor
CREATE OR REPLACE VIEW resumen_oc_por_proveedor AS
SELECT 
    p.proveedor_id,
    p.alias_proveedor,
    p.razon_social,
    COUNT(oc.oc_id) as total_ordenes,
    COALESCE(SUM(oc.total), 0) as total_comprometido,
    COALESCE(SUM(pg.monto_pagado), 0) as total_pagado,
    COALESCE(SUM(oc.total), 0) - COALESCE(SUM(pg.monto_pagado), 0) as saldo_pendiente
FROM proveedores p
LEFT JOIN ordenes_compra oc ON p.proveedor_id = oc.proveedor_id AND oc.estatus IN ('aprobada', 'entregada')
LEFT JOIN pagos pg ON oc.oc_id = pg.oc_id AND pg.estatus = 'aplicado'
GROUP BY p.proveedor_id, p.alias_proveedor, p.razon_social;

-- Vista: estado_requisiciones
-- Dashboard de requisiciones
CREATE OR REPLACE VIEW estado_requisiciones AS
SELECT 
    r.obra_id,
    o.nombre_obra,
    COUNT(*) as total_requisiciones,
    COUNT(CASE WHEN r.estatus = 'pendiente' THEN 1 END) as pendientes,
    COUNT(CASE WHEN r.estatus = 'en_revision' THEN 1 END) as en_revision,
    COUNT(CASE WHEN r.urgencia = 'urgente' AND r.estatus NOT IN ('convertida_oc', 'rechazada') THEN 1 END) as urgentes
FROM requisiciones_material r
JOIN obras o ON r.obra_id = o.obra_id
GROUP BY r.obra_id, o.nombre_obra;
