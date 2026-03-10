# IDP ERP - Database Schema

## Nomenclatura y Convenciones

- **Tablas**: snake_case
- **IDs**: `{entidad}_id` (VARCHAR/UUID)
- **Timestamps**: `created_at`, `updated_at`
- **Flags booleanos**: `activo`, `aplica_iva`, etc.
- **Montos**: DECIMAL(15,2) para dinero
- **Cantidades**: DECIMAL(10,2) para inventarios

## Estructura de Módulos

### 1. CATÁLOGOS BASE

#### `obras`
Proyectos de construcción activos y finalizados.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| obra_id | VARCHAR(50) PK | ID único de la obra |
| codigo_obra | VARCHAR(20) UNIQUE | Código corto (ej: "227", "228") |
| nombre_obra | VARCHAR(200) | Nombre descriptivo |
| cliente | VARCHAR(200) | Nombre del cliente |
| residente | VARCHAR(100) | Nombre del residente de obra |
| direccion | TEXT | Ubicación física |
| fecha_inicio | DATE | Fecha de inicio del proyecto |
| fecha_fin_estimada | DATE | Fecha estimada de término |
| presupuesto_total | DECIMAL(15,2) | Presupuesto asignado |
| estatus | VARCHAR(20) | activa, pausada, terminada, cancelada |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Índices**: `codigo_obra`, `estatus`

---

#### `proveedores`
Catálogo de proveedores de materiales y servicios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| proveedor_id | VARCHAR(50) PK | ID único |
| alias_proveedor | VARCHAR(50) UNIQUE | Nombre corto (CEMEX, LEVINSON) |
| razon_social | VARCHAR(200) | Razón social completa |
| rfc | VARCHAR(13) UNIQUE | RFC del proveedor |
| direccion | TEXT | Dirección fiscal |
| ciudad | VARCHAR(100) | |
| codigo_postal | VARCHAR(10) | |
| telefono | VARCHAR(20) | |
| email | VARCHAR(100) | |
| contacto_principal | VARCHAR(100) | Persona de contacto |
| banco | VARCHAR(100) | Banco para pagos |
| numero_cuenta | VARCHAR(50) | Cuenta bancaria |
| clabe | VARCHAR(18) | CLABE interbancaria |
| tipo_proveedor | VARCHAR(20) | material, servicio, renta, mixto |
| dias_credito | INTEGER | Días de crédito otorgados |
| limite_credito | DECIMAL(15,2) | Límite de crédito |
| activo | BOOLEAN | Si está activo |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Índices**: `alias_proveedor`, `activo`

---

### 2. MÓDULO REQUISICIONES

#### `requisiciones_material`
Solicitudes de material de residentes de obra.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| requisicion_id | VARCHAR(50) PK | |
| numero_requisicion | VARCHAR(50) UNIQUE | Número consecutivo |
| obra_id | VARCHAR(50) FK | → obras.obra_id |
| residente_nombre | VARCHAR(100) | Quien solicita |
| fecha_creacion | DATE | |
| fecha_entrega_requerida | DATE | Cuándo se necesita |
| urgencia | VARCHAR(20) | urgente, normal, planeado |
| estatus | VARCHAR(30) | pendiente, en_revision, aprobada, rechazada, convertida_oc |
| observaciones | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Relaciones**: 
- `obra_id` → `obras.obra_id`

**Índices**: `obra_id`, `estatus`, `urgencia`

---

#### `requisiciones_material_items`
Ítems solicitados en cada requisición.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| item_id | VARCHAR(50) PK | |
| requisicion_id | VARCHAR(50) FK | → requisiciones_material |
| descripcion | TEXT | Material solicitado |
| cantidad | DECIMAL(10,2) | |
| unidad | VARCHAR(20) | M3, BULTO, PZA, etc. |
| orden_item | INTEGER | Orden de visualización |
| created_at | TIMESTAMP | |

**Relaciones**:
- `requisicion_id` → `requisiciones_material.requisicion_id` (ON DELETE CASCADE)

---

#### `requisiciones_comentarios`
Conversación/seguimiento en requisiciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| comentario_id | VARCHAR(50) PK | |
| requisicion_id | VARCHAR(50) FK | → requisiciones_material |
| autor | VARCHAR(100) | Quién comenta |
| rol | VARCHAR(50) | Residente, Compras, etc. |
| mensaje | TEXT | Contenido del comentario |
| fecha_comentario | TIMESTAMP | |

**Relaciones**:
- `requisicion_id` → `requisiciones_material.requisicion_id` (ON DELETE CASCADE)

---

### 3. MÓDULO ÓRDENES DE COMPRA

#### `ordenes_compra`
Órdenes de compra emitidas a proveedores.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| oc_id | VARCHAR(50) PK | |
| numero_oc | VARCHAR(50) UNIQUE | Número de OC |
| obra_id | VARCHAR(50) FK | → obras |
| proveedor_id | VARCHAR(50) FK | → proveedores |
| comprador | VARCHAR(100) | Quien genera la OC |
| fecha_creacion | DATE | |
| fecha_entrega | DATE | Fecha comprometida de entrega |
| tipo_entrega | VARCHAR(20) | entrega, recoleccion |
| aplica_iva | BOOLEAN | Si lleva IVA |
| porcentaje_descuento | DECIMAL(5,2) | % de descuento |
| subtotal | DECIMAL(15,2) | Suma de items |
| monto_descuento | DECIMAL(15,2) | Descuento aplicado |
| iva | DECIMAL(15,2) | IVA calculado |
| total | DECIMAL(15,2) | Total final |
| observaciones | TEXT | |
| estatus | VARCHAR(30) | pendiente, aprobada, rechazada, entregada, cancelada |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Relaciones**:
- `obra_id` → `obras.obra_id`
- `proveedor_id` → `proveedores.proveedor_id`

**Índices**: `obra_id`, `proveedor_id`, `estatus`, `fecha_creacion`

---

#### `ordenes_compra_items`
Partidas/conceptos de cada orden de compra.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| item_id | VARCHAR(50) PK | |
| oc_id | VARCHAR(50) FK | → ordenes_compra |
| descripcion | TEXT | Descripción del material |
| cantidad | DECIMAL(10,2) | |
| unidad | VARCHAR(20) | PZA, M3, etc. |
| precio_unitario | DECIMAL(12,2) | |
| subtotal_item | DECIMAL(15,2) | cantidad * precio_unitario |
| orden_item | INTEGER | Orden de aparición |
| created_at | TIMESTAMP | |

**Relaciones**:
- `oc_id` → `ordenes_compra.oc_id` (ON DELETE CASCADE)

---

### 4. MÓDULO PAGOS

#### `pagos`
Registro de pagos realizados a proveedores por OCs.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| pago_id | VARCHAR(50) PK | |
| oc_id | VARCHAR(50) FK | → ordenes_compra |
| obra_id | VARCHAR(50) FK | → obras |
| proveedor_id | VARCHAR(50) FK | → proveedores |
| numero_pago | VARCHAR(50) UNIQUE | Folio de pago |
| fecha_pago | DATE | Cuándo se realizó |
| monto_pagado | DECIMAL(15,2) | Cantidad pagada |
| metodo_pago | VARCHAR(50) | transferencia, cheque, efectivo, tarjeta |
| referencia_pago | VARCHAR(100) | Referencia bancaria |
| banco | VARCHAR(100) | Banco emisor |
| factura_numero | VARCHAR(50) | Número de factura |
| factura_xml_url | TEXT | URL del XML |
| factura_pdf_url | TEXT | URL del PDF |
| notas | TEXT | |
| estatus | VARCHAR(30) | pendiente, aplicado, cancelado |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Relaciones**:
- `oc_id` → `ordenes_compra.oc_id`
- `obra_id` → `obras.obra_id`
- `proveedor_id` → `proveedores.proveedor_id`

**Índices**: `oc_id`, `obra_id`, `proveedor_id`, `fecha_pago`, `estatus`

---

### 5. MÓDULO ENTREGAS (FUTURO)

#### `entregas`
Registro de entregas de material en obra.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| entrega_id | VARCHAR(50) PK | |
| oc_id | VARCHAR(50) FK | → ordenes_compra |
| obra_id | VARCHAR(50) FK | → obras |
| numero_entrega | VARCHAR(50) UNIQUE | |
| fecha_entrega | DATE | |
| quien_recibe | VARCHAR(100) | Persona que recibe |
| observaciones | TEXT | |
| estatus | VARCHAR(30) | parcial, completa, con_incidencia |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

#### `entregas_items`
Detalle de qué se entregó.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| entrega_item_id | VARCHAR(50) PK | |
| entrega_id | VARCHAR(50) FK | → entregas |
| oc_item_id | VARCHAR(50) FK | → ordenes_compra_items |
| cantidad_entregada | DECIMAL(10,2) | |
| observaciones | TEXT | |
| created_at | TIMESTAMP | |

---

## Vistas Calculadas

### `metricas_obra`
Métricas financieras consolidadas por obra.

```sql
SELECT 
    obra_id,
    presupuesto_total,
    total_comprometido,      -- SUM(oc.total) WHERE estatus IN (aprobada, entregada)
    total_pagado,            -- SUM(pagos.monto) WHERE estatus = aplicado
    presupuesto_disponible,  -- presupuesto - comprometido
    saldo_por_pagar          -- comprometido - pagado
FROM metricas_obra
```

### `resumen_oc_por_proveedor`
Total de órdenes y pagos por proveedor.

```sql
SELECT 
    proveedor_id,
    alias_proveedor,
    total_ordenes,
    total_comprometido,
    total_pagado,
    saldo_pendiente
FROM resumen_oc_por_proveedor
```

### `estado_requisiciones`
Dashboard de requisiciones por obra.

```sql
SELECT 
    obra_id,
    total_requisiciones,
    pendientes,
    en_revision,
    urgentes
FROM estado_requisiciones
```

---

## Relaciones Principales

```
obras (1) ──< (N) ordenes_compra
obras (1) ──< (N) requisiciones_material
obras (1) ──< (N) pagos
obras (1) ──< (N) entregas

proveedores (1) ──< (N) ordenes_compra
proveedores (1) ──< (N) pagos

ordenes_compra (1) ──< (N) ordenes_compra_items
ordenes_compra (1) ──< (N) pagos
ordenes_compra (1) ──< (N) entregas

requisiciones_material (1) ──< (N) requisiciones_material_items
requisiciones_material (1) ──< (N) requisiciones_comentarios

entregas (1) ──< (N) entregas_items
ordenes_compra_items (1) ──< (N) entregas_items
```

---

## Reglas de Negocio

1. **Montos en OC**: Los totales se calculan automáticamente:
   - `subtotal` = SUM(items.subtotal_item)
   - `monto_descuento` = subtotal * (porcentaje_descuento / 100)
   - `iva` = (subtotal - monto_descuento) * 0.16 (si aplica_iva = true)
   - `total` = subtotal - monto_descuento + iva

2. **Pagos**: Un pago siempre está ligado a una OC específica. Pueden existir múltiples pagos parciales para una misma OC.

3. **Saldo por pagar**: Se calcula como `total_oc - SUM(pagos_aplicados)`

4. **Requisiciones**: Pueden convertirse en OCs. El campo `estatus` cambia a `convertida_oc`.

5. **Entregas**: Pueden ser parciales. Se comparan cantidades entregadas vs cantidades en OC.
