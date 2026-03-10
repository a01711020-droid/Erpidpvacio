# ESPECIFICACIÓN COMPLETA DE BASE DE DATOS - ERP CONSTRUCTORA IDP

## 📋 ÍNDICE
1. [Obras/Proyectos](#1-obras--proyectos)
2. [Proveedores](#2-proveedores)
3. [Órdenes de Compra](#3-órdenes-de-compra)
4. [Items de Órdenes de Compra](#4-items-de-órdenes-de-compra)
5. [Facturas](#5-facturas)
6. [Pagos](#6-pagos)
7. [Destajistas](#7-destajistas)
8. [Avances de Destajos](#8-avances-de-destajos)
9. [Requisiciones de Material](#9-requisiciones-de-material)
10. [Items de Requisiciones](#10-items-de-requisiciones)
11. [Usuarios](#11-usuarios)
12. [Relaciones entre Tablas](#relaciones-entre-tablas)
13. [Índices Recomendados](#índices-recomendados)

---

## 1. OBRAS / PROYECTOS

**Tabla:** `obras`  
**Descripción:** Proyectos de construcción activos y archivados de la constructora

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `obra_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `codigo_obra` | STRING | ✅ | Código corto de 3 dígitos | "228", "229", "230", etc. |
| `nombre_obra` | STRING | ✅ | Nombre del proyecto | "CASTELLO TORRE F/G/H" |
| `numero_contrato` | STRING | ✅ | Número de contrato oficial | "CON-2024-001" |
| `cliente` | STRING | ✅ | Nombre del cliente | "CASTELLO INMOBILIARIO" |
| `residente` | STRING | ✅ | Nombre del residente de obra | "Ing. Carlos Méndez" |
| `direccion` | STRING | ❌ | Dirección física de la obra | |
| `monto_contratado` | DECIMAL | ✅ | Monto total del contrato | >= 0 |
| `fecha_inicio` | DATE | ✅ | Fecha de inicio de obra | YYYY-MM-DD |
| `fecha_fin_programada` | DATE | ✅ | Fecha programada de término | YYYY-MM-DD |
| `plazo_dias` | INTEGER | ❌ | Plazo de ejecución en días | >= 1 |
| `estado` | ENUM | ✅ | Estado actual | "activa", "suspendida", "terminada", "cancelada" |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `obra_id`
- UNIQUE: `codigo_obra`
- INDEX: `codigo_obra`, `estado`, `cliente`

### Datos Reales (6 obras):
```typescript
[
  { codigo: "228", nombre: "CASTELLO TORRE F/G/H", cliente: "CASTELLO INMOBILIARIO" },
  { codigo: "229", nombre: "CASTELLO TORRE F/G/H", cliente: "CASTELLO INMOBILIARIO" },
  { codigo: "230", nombre: "DOZA TORRE A", cliente: "DESARROLLOS DOZA" },
  { codigo: "231", nombre: "DOZA TORRE C", cliente: "DESARROLLOS DOZA" },
  { codigo: "232", nombre: "BALVANERA", cliente: "GRUPO BALVANERA" },
  { codigo: "233", nombre: "BALVANERA", cliente: "GRUPO BALVANERA" }
]
```

---

## 2. PROVEEDORES

**Tabla:** `proveedores`  
**Descripción:** Catálogo de proveedores de materiales y servicios

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `proveedor_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `nombre_comercial` | STRING | ❌ | Nombre corto/comercial | "CEMEX", "LEVINSON" |
| `razon_social` | STRING | ✅ | Razón social completa | "CEMEX MÉXICO SA DE CV" |
| `rfc` | STRING | ✅ | RFC del proveedor | 13 caracteres (A-Z, 0-9) |
| `direccion` | STRING | ❌ | Dirección fiscal | |
| `ciudad` | STRING | ❌ | Ciudad | |
| `codigo_postal` | STRING | ❌ | Código postal | |
| `telefono` | STRING | ❌ | Teléfono de contacto | |
| `email` | STRING | ❌ | Email de contacto | formato email válido |
| `contacto_principal` | STRING | ❌ | Nombre del contacto | |
| `banco` | STRING | ❌ | Banco para transferencias | |
| `numero_cuenta` | STRING | ❌ | Número de cuenta bancaria | |
| `clabe` | STRING | ❌ | CLABE interbancaria | 18 dígitos |
| `tipo_proveedor` | ENUM | ❌ | Tipo de proveedor | "material", "servicio", "renta", "mixto" |
| `dias_credito` | INTEGER | ❌ | Días de crédito otorgados | >= 0, default: 0 |
| `limite_credito` | DECIMAL | ❌ | Límite de crédito | >= 0, default: 0 |
| `activo` | BOOLEAN | ✅ | Si está activo | default: true |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `proveedor_id`
- UNIQUE: `rfc`
- INDEX: `nombre_comercial`, `activo`, `tipo_proveedor`

---

## 3. ÓRDENES DE COMPRA

**Tabla:** `ordenes_compra`  
**Descripción:** Órdenes de compra emitidas a proveedores

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `orden_compra_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `folio` | STRING | ✅ | Folio estructurado | "227-A01GM-CEMEX" |
| `obra_id` | UUID | ✅ | ID de la obra (FK) | → obras.obra_id |
| `proveedor_id` | UUID | ✅ | ID del proveedor (FK) | → proveedores.proveedor_id |
| `requisicion_id` | UUID | ❌ | ID de requisición origen (FK) | → requisiciones.requisicion_id |
| `fecha_emision` | DATE | ✅ | Fecha de emisión | YYYY-MM-DD |
| `fecha_entrega` | DATE | ✅ | Fecha programada de entrega | YYYY-MM-DD |
| `estado` | ENUM | ✅ | Estado actual | "borrador", "emitida", "parcialmente_pagada", "pagada", "cancelada" |
| `tipo_entrega` | ENUM | ❌ | Tipo de entrega | "en_obra", "bodega", "recoger" |
| `subtotal` | DECIMAL | ✅ | Subtotal antes de impuestos | >= 0 |
| `descuento_porcentaje` | DECIMAL | ❌ | Porcentaje de descuento | 0-100, default: 0 |
| `descuento_monto` | DECIMAL | ❌ | Monto del descuento | >= 0, default: 0 |
| `iva` | DECIMAL | ❌ | Monto del IVA (16%) | >= 0, default: 0 |
| `total` | DECIMAL | ✅ | Total final | >= 0 |
| `monto_pagado` | DECIMAL | ❌ | Monto ya pagado | >= 0, default: 0 |
| `saldo_pendiente` | DECIMAL | ✅ | Saldo pendiente | >= 0 |
| `observaciones` | TEXT | ❌ | Observaciones adicionales | |
| `creado_por` | STRING | ❌ | Usuario creador | |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `orden_compra_id`
- UNIQUE: `folio`
- FK: `obra_id` → obras, `proveedor_id` → proveedores, `requisicion_id` → requisiciones
- INDEX: `folio`, `obra_id`, `proveedor_id`, `estado`, `fecha_emision`

### Formato de Folio:
```
{codigo_obra}-{secuencial}{tipo_material}-{nombre_proveedor}
Ejemplo: 227-A01GM-CEMEX
  - 227: código de obra
  - A01: secuencial alfabético
  - GM: tipo de material (General, Materiales)
  - CEMEX: nombre del proveedor
```

---

## 4. ITEMS DE ÓRDENES DE COMPRA

**Tabla:** `orden_compra_items`  
**Descripción:** Items/partidas individuales de cada orden de compra

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `item_id` | UUID | ��� | ID único (PK) | UUID v4 |
| `orden_compra_id` | UUID | ✅ | ID de la orden (FK) | → ordenes_compra.orden_compra_id |
| `numero_linea` | INTEGER | ✅ | Número de línea en la orden | >= 1 |
| `cantidad` | DECIMAL | ✅ | Cantidad del item | > 0 |
| `unidad` | STRING | ✅ | Unidad de medida | "M3", "BULTO", "PZA", "KG", "M2", etc. |
| `descripcion` | TEXT | ✅ | Descripción del material/servicio | |
| `precio_unitario` | DECIMAL | ✅ | Precio unitario | >= 0 |
| `total` | DECIMAL | ✅ | Total (cantidad × precio) | >= 0 |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `item_id`
- FK: `orden_compra_id` → ordenes_compra
- UNIQUE: `(orden_compra_id, numero_linea)`
- INDEX: `orden_compra_id`

---

## 5. FACTURAS

**Tabla:** `facturas`  
**Descripción:** Facturas recibidas de proveedores asociadas a órdenes de compra

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `factura_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `orden_compra_id` | UUID | ✅ | ID de la orden (FK) | → ordenes_compra.orden_compra_id |
| `proveedor_id` | UUID | ✅ | ID del proveedor (FK) | → proveedores.proveedor_id |
| `obra_id` | UUID | ✅ | ID de la obra (FK, denormalizado) | → obras.obra_id |
| `folio_factura` | STRING | ✅ | Folio de la factura | |
| `monto_factura` | DECIMAL | ✅ | Monto total de la factura | > 0 |
| `fecha_factura` | DATE | ✅ | Fecha de emisión de factura | YYYY-MM-DD |
| `dias_credito` | INTEGER | ✅ | Días de crédito | >= 0 |
| `fecha_vencimiento` | DATE | ✅ | Fecha de vencimiento | YYYY-MM-DD |
| `dias_vencidos` | INTEGER | ✅ | Días vencidos (calculado) | puede ser negativo |
| `archivo_pdf_url` | STRING | ❌ | URL del PDF de la factura | |
| `archivo_xml_url` | STRING | ❌ | URL del XML de la factura | |
| `estado` | ENUM | ✅ | Estado de la factura | "pendiente", "pagada", "vencida" |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `factura_id`
- FK: `orden_compra_id` → ordenes_compra, `proveedor_id` → proveedores, `obra_id` → obras
- INDEX: `orden_compra_id`, `proveedor_id`, `obra_id`, `estado`, `fecha_vencimiento`

---

## 6. PAGOS

**Tabla:** `pagos`  
**Descripción:** Pagos realizados a proveedores (pueden ser parciales o totales)

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `pago_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `folio_pago` | STRING | ✅ | Folio del pago | "PAG-227-001" o "PAG-227-001-P1" |
| `orden_compra_id` | UUID | ✅ | ID de la orden (FK) | → ordenes_compra.orden_compra_id |
| `factura_id` | UUID | ❌ | ID de la factura (FK) | → facturas.factura_id |
| `obra_id` | UUID | ✅ | ID de la obra (FK, denormalizado) | → obras.obra_id |
| `proveedor_id` | UUID | ✅ | ID del proveedor (FK, denormalizado) | → proveedores.proveedor_id |
| `tipo_pago` | ENUM | ✅ | Tipo de pago | "total", "parcial" |
| `numero_parcialidad` | INTEGER | ❌ | Número de parcialidad | >= 1 (si tipo=parcial) |
| `monto_pago` | DECIMAL | ✅ | Monto de este pago | > 0 |
| `metodo_pago` | ENUM | ❌ | Método de pago | "transferencia", "cheque", "efectivo" |
| `fecha_programada` | DATE | ✅ | Fecha programada | YYYY-MM-DD |
| `fecha_procesado` | TIMESTAMP | ❌ | Fecha procesado | ISO 8601 |
| `semana_fiscal` | INTEGER | ❌ | Semana fiscal del año | 1-53 |
| `estado` | ENUM | ✅ | Estado actual | "programado", "procesando", "completado", "cancelado" |
| `referencia_bancaria` | STRING | ❌ | Referencia o núm. de cheque | |
| `comprobante_url` | STRING | ❌ | URL del comprobante | |
| `requiere_factura` | BOOLEAN | ✅ | Si requiere factura | default: true |
| `factura_recibida` | BOOLEAN | ✅ | Si recibió factura | default: false |
| `observaciones` | TEXT | ❌ | Observaciones | |
| `procesado_por` | STRING | ❌ | Usuario que procesó | |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `pago_id`
- UNIQUE: `folio_pago`
- FK: `orden_compra_id` → ordenes_compra, `factura_id` → facturas, `obra_id` → obras, `proveedor_id` → proveedores
- INDEX: `orden_compra_id`, `obra_id`, `proveedor_id`, `estado`, `fecha_programada`

---

## 7. DESTAJISTAS

**Tabla:** `destajistas`  
**Descripción:** Catálogo de destajistas/trabajadores especializados

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `destajista_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `inicial` | STRING | ✅ | Iniciales identificadoras | "AG", "AR", "IDP", etc. (2-3 chars) |
| `nombre` | STRING | ✅ | Nombre completo | "Abraham Garcia" |
| `color` | STRING | ✅ | Color HEX para identificación visual | "#b91c1c" |
| `especialidad` | STRING | ✅ | Especialidad del destajista | "Fierrero", "Bloquero", "Yesero", etc. |
| `telefono` | STRING | ❌ | Teléfono de contacto | |
| `activo` | BOOLEAN | ✅ | Si está activo | default: true |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `destajista_id`
- UNIQUE: `inicial`
- INDEX: `inicial`, `activo`, `especialidad`

### Datos Reales (32 destajistas):
Ver archivo `/spec/destajos/destajistas.mock.ts` con los 32 destajistas reales.

---

## 8. AVANCES DE DESTAJOS

**Tabla:** `avances_destajos`  
**Descripción:** Registro semanal de avances de trabajo por destajista y obra

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `avance_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `obra_id` | UUID | ✅ | ID de la obra (FK) | → obras.obra_id |
| `destajista_id` | UUID | ✅ | ID del destajista (FK) | → destajistas.destajista_id |
| `semana` | INTEGER | ✅ | Número de semana del año | 1-53 |
| `año` | INTEGER | ✅ | Año | YYYY |
| `fecha_inicio_semana` | DATE | ✅ | Fecha de inicio de semana | YYYY-MM-DD (lunes) |
| `fecha_fin_semana` | DATE | ✅ | Fecha de fin de semana | YYYY-MM-DD (domingo) |
| `nivel` | STRING | ✅ | Nivel/piso trabajado | "N0", "N1", "N2", etc. |
| `cantidad` | DECIMAL | ✅ | Cantidad de trabajo realizado | >= 0 |
| `unidad` | STRING | ✅ | Unidad de medida | "M2", "M3", "ML", "PZA", etc. |
| `concepto` | TEXT | ✅ | Descripción del trabajo | "Losa armada con acero", etc. |
| `precio_unitario` | DECIMAL | ✅ | Precio por unidad | >= 0 |
| `importe_total` | DECIMAL | ✅ | Importe total (cantidad × precio) | >= 0 |
| `estado` | ENUM | ✅ | Estado del registro | "borrador", "confirmado", "pagado" |
| `observaciones` | TEXT | ❌ | Observaciones adicionales | |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `avance_id`
- FK: `obra_id` → obras, `destajista_id` → destajistas
- UNIQUE: `(obra_id, destajista_id, semana, año, nivel, concepto)`
- INDEX: `obra_id`, `destajista_id`, `semana`, `año`, `estado`

---

## 9. REQUISICIONES DE MATERIAL

**Tabla:** `requisiciones`  
**Descripción:** Requisiciones de material solicitadas por obra

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `requisicion_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `folio` | STRING | ✅ | Folio de la requisición | "REQ-227-001" |
| `obra_id` | UUID | ✅ | ID de la obra (FK) | → obras.obra_id |
| `fecha_solicitud` | DATE | ✅ | Fecha de solicitud | YYYY-MM-DD |
| `fecha_necesaria` | DATE | ✅ | Fecha necesaria en obra | YYYY-MM-DD |
| `solicitante` | STRING | ✅ | Nombre del solicitante | |
| `estado` | ENUM | ✅ | Estado actual | "pendiente", "aprobada", "en_proceso", "completada", "cancelada" |
| `prioridad` | ENUM | ✅ | Prioridad | "baja", "normal", "alta", "urgente" |
| `observaciones` | TEXT | ❌ | Observaciones | |
| `aprobado_por` | STRING | ❌ | Usuario que aprobó | |
| `fecha_aprobacion` | TIMESTAMP | ❌ | Fecha de aprobación | ISO 8601 |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `requisicion_id`
- UNIQUE: `folio`
- FK: `obra_id` → obras
- INDEX: `obra_id`, `estado`, `fecha_solicitud`, `prioridad`

---

## 10. ITEMS DE REQUISICIONES

**Tabla:** `requisicion_items`  
**Descripción:** Items individuales de cada requisición

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `item_id` | UUID | ✅ | ID único (PK) | UUID v4 |
| `requisicion_id` | UUID | ✅ | ID de la requisición (FK) | → requisiciones.requisicion_id |
| `numero_linea` | INTEGER | ✅ | Número de línea | >= 1 |
| `cantidad` | DECIMAL | ✅ | Cantidad solicitada | > 0 |
| `unidad` | STRING | ✅ | Unidad de medida | "M3", "BULTO", "PZA", etc. |
| `descripcion` | TEXT | ✅ | Descripción del material | |
| `proveedor_sugerido` | STRING | ❌ | Proveedor sugerido | |
| `precio_estimado` | DECIMAL | ❌ | Precio estimado unitario | >= 0 |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `item_id`
- FK: `requisicion_id` → requisiciones
- UNIQUE: `(requisicion_id, numero_linea)`
- INDEX: `requisicion_id`

---

## 11. USUARIOS

**Tabla:** `usuarios`  
**Descripción:** Usuarios del sistema (usando Supabase Auth)

### Campos:

| Campo | Tipo | Requerido | Descripción | Valores/Formato |
|-------|------|-----------|-------------|-----------------|
| `usuario_id` | UUID | ✅ | ID único (PK) | UUID v4 (sync con auth.users) |
| `email` | STRING | ✅ | Email del usuario | formato email válido |
| `nombre_completo` | STRING | ✅ | Nombre completo | |
| `rol` | ENUM | ✅ | Rol en el sistema | "admin", "gerente", "residente", "comprador", "contador" |
| `obras_asignadas` | JSON | ❌ | Array de obra_ids asignadas | ["uuid1", "uuid2"] |
| `activo` | BOOLEAN | ✅ | Si está activo | default: true |
| `ultimo_acceso` | TIMESTAMP | ❌ | Último acceso al sistema | ISO 8601 |
| `created_at` | TIMESTAMP | ✅ | Fecha de creación (auto) | ISO 8601 |
| `updated_at` | TIMESTAMP | ✅ | Última actualización (auto) | ISO 8601 |

### Restricciones:
- PK: `usuario_id`
- UNIQUE: `email`
- INDEX: `email`, `rol`, `activo`

---

## RELACIONES ENTRE TABLAS

### Diagrama de Relaciones:

```
usuarios (1) ──< (N) [created_by] → ordenes_compra, requisiciones, pagos

obras (1) ──< (N) ordenes_compra
obras (1) ──< (N) requisiciones
obras (1) ──< (N) avances_destajos
obras (1) ──< (N) facturas
obras (1) ──< (N) pagos

proveedores (1) ──< (N) ordenes_compra
proveedores (1) ──< (N) facturas
proveedores (1) ──< (N) pagos

requisiciones (1) ──< (N) requisicion_items
requisiciones (1) ──< (1) ordenes_compra [opcional]

ordenes_compra (1) ──< (N) orden_compra_items
ordenes_compra (1) ──< (N) facturas
ordenes_compra (1) ──< (N) pagos

facturas (1) ──< (N) pagos [opcional]

destajistas (1) ──< (N) avances_destajos
```

---

## ÍNDICES RECOMENDADOS

### Índices Primarios (PKs):
✅ Todas las tablas tienen UUID como PK

### Índices Únicos:
- `obras.codigo_obra`
- `proveedores.rfc`
- `ordenes_compra.folio`
- `facturas.folio_factura`
- `pagos.folio_pago`
- `requisiciones.folio`
- `destajistas.inicial`
- `usuarios.email`

### Índices Compuestos:
- `orden_compra_items (orden_compra_id, numero_linea)`
- `requisicion_items (requisicion_id, numero_linea)`
- `avances_destajos (obra_id, semana, año)`
- `avances_destajos (destajista_id, semana, año)`
- `avances_destajos (obra_id, destajista_id, semana, año, nivel, concepto)` - UNIQUE

### Índices de Búsqueda:
- `ordenes_compra (obra_id, estado, fecha_emision)`
- `pagos (obra_id, estado, fecha_programada)`
- `facturas (proveedor_id, estado, fecha_vencimiento)`
- `requisiciones (obra_id, estado, prioridad)`

---

## TIPOS TYPESCRIPT CONSOLIDADOS

```typescript
// ==================== OBRAS ====================
export interface Obra {
  obra_id: string; // UUID
  codigo_obra: string; // "228", "229", etc.
  nombre_obra: string;
  numero_contrato: string;
  cliente: string;
  residente: string;
  direccion?: string;
  monto_contratado: number;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin_programada: string; // YYYY-MM-DD
  plazo_dias?: number;
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// ==================== PROVEEDORES ====================
export interface Proveedor {
  proveedor_id: string; // UUID
  nombre_comercial?: string;
  razon_social: string;
  rfc: string;
  direccion?: string;
  ciudad?: string;
  codigo_postal?: string;
  telefono?: string;
  email?: string;
  contacto_principal?: string;
  banco?: string;
  numero_cuenta?: string;
  clabe?: string;
  tipo_proveedor?: "material" | "servicio" | "renta" | "mixto";
  dias_credito: number;
  limite_credito: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== ÓRDENES DE COMPRA ====================
export interface OrdenCompra {
  orden_compra_id: string; // UUID
  folio: string; // "227-A01GM-CEMEX"
  obra_id: string; // UUID FK
  proveedor_id: string; // UUID FK
  requisicion_id?: string; // UUID FK
  fecha_emision: string; // YYYY-MM-DD
  fecha_entrega: string; // YYYY-MM-DD
  estado: "borrador" | "emitida" | "parcialmente_pagada" | "pagada" | "cancelada";
  tipo_entrega?: "en_obra" | "bodega" | "recoger";
  subtotal: number;
  descuento_porcentaje: number;
  descuento_monto: number;
  iva: number;
  total: number;
  monto_pagado: number;
  saldo_pendiente: number;
  observaciones?: string;
  creado_por?: string;
  items: OrdenCompraItem[];
  created_at: string;
  updated_at: string;
}

export interface OrdenCompraItem {
  item_id: string; // UUID
  orden_compra_id: string; // UUID FK
  numero_linea: number;
  cantidad: number;
  unidad: string;
  descripcion: string;
  precio_unitario: number;
  total: number;
  created_at: string;
  updated_at: string;
}

// ==================== FACTURAS ====================
export interface Factura {
  factura_id: string; // UUID
  orden_compra_id: string; // UUID FK
  proveedor_id: string; // UUID FK
  obra_id: string; // UUID FK
  folio_factura: string;
  monto_factura: number;
  fecha_factura: string; // YYYY-MM-DD
  dias_credito: number;
  fecha_vencimiento: string; // YYYY-MM-DD
  dias_vencidos: number;
  archivo_pdf_url?: string;
  archivo_xml_url?: string;
  estado: "pendiente" | "pagada" | "vencida";
  created_at: string;
  updated_at: string;
}

// ==================== PAGOS ====================
export interface Pago {
  pago_id: string; // UUID
  folio_pago: string; // "PAG-227-001" o "PAG-227-001-P1"
  orden_compra_id: string; // UUID FK
  factura_id?: string; // UUID FK
  obra_id: string; // UUID FK
  proveedor_id: string; // UUID FK
  tipo_pago: "total" | "parcial";
  numero_parcialidad?: number;
  monto_pago: number;
  metodo_pago?: "transferencia" | "cheque" | "efectivo";
  fecha_programada: string; // YYYY-MM-DD
  fecha_procesado?: string; // ISO 8601
  semana_fiscal?: number;
  estado: "programado" | "procesando" | "completado" | "cancelado";
  referencia_bancaria?: string;
  comprobante_url?: string;
  requiere_factura: boolean;
  factura_recibida: boolean;
  observaciones?: string;
  procesado_por?: string;
  created_at: string;
  updated_at: string;
}

// ==================== DESTAJISTAS ====================
export interface Destajista {
  destajista_id: string; // UUID
  inicial: string; // "AG", "AR", etc.
  nombre: string;
  color: string; // HEX color
  especialidad: string; // "Fierrero", "Bloquero", etc.
  telefono?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== AVANCES DESTAJOS ====================
export interface AvanceDestajo {
  avance_id: string; // UUID
  obra_id: string; // UUID FK
  destajista_id: string; // UUID FK
  semana: number; // 1-53
  año: number; // YYYY
  fecha_inicio_semana: string; // YYYY-MM-DD
  fecha_fin_semana: string; // YYYY-MM-DD
  nivel: string; // "N0", "N1", etc.
  cantidad: number;
  unidad: string; // "M2", "M3", etc.
  concepto: string;
  precio_unitario: number;
  importe_total: number;
  estado: "borrador" | "confirmado" | "pagado";
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

// ==================== REQUISICIONES ====================
export interface Requisicion {
  requisicion_id: string; // UUID
  folio: string; // "REQ-227-001"
  obra_id: string; // UUID FK
  fecha_solicitud: string; // YYYY-MM-DD
  fecha_necesaria: string; // YYYY-MM-DD
  solicitante: string;
  estado: "pendiente" | "aprobada" | "en_proceso" | "completada" | "cancelada";
  prioridad: "baja" | "normal" | "alta" | "urgente";
  observaciones?: string;
  aprobado_por?: string;
  fecha_aprobacion?: string;
  items: RequisicionItem[];
  created_at: string;
  updated_at: string;
}

export interface RequisicionItem {
  item_id: string; // UUID
  requisicion_id: string; // UUID FK
  numero_linea: number;
  cantidad: number;
  unidad: string;
  descripcion: string;
  proveedor_sugerido?: string;
  precio_estimado?: number;
  created_at: string;
  updated_at: string;
}

// ==================== USUARIOS ====================
export interface Usuario {
  usuario_id: string; // UUID (sync con auth.users)
  email: string;
  nombre_completo: string;
  rol: "admin" | "gerente" | "residente" | "comprador" | "contador";
  obras_asignadas?: string[]; // Array de obra_ids
  activo: boolean;
  ultimo_acceso?: string;
  created_at: string;
  updated_at: string;
}
```

---

## NOTAS IMPORTANTES

### Estrategia de Implementación:
1. **Key-Value Store**: Usar la tabla `kv_store_4298db9c` existente con claves estructuradas
2. **Formato de Claves**: `{tipo}:{id}` o `{tipo}:{campo}:{valor}`
3. **Valores**: Objetos JSON serializados con los tipos definidos arriba

### Ejemplos de Claves KV:
```typescript
// Obras
"obra:228" → { obra_id, codigo_obra: "228", ... }
"obra:index:codigo" → ["228", "229", "230", "231", "232", "233"]

// Órdenes de Compra
"oc:uuid-123" → { orden_compra_id, folio, ... }
"oc:index:obra:228" → ["uuid-1", "uuid-2", ...]
"oc:index:folio:227-A01GM-CEMEX" → "uuid-123"

// Destajistas
"destajista:AG" → { destajista_id, inicial: "AG", ... }
"destajista:index:all" → ["AG", "AR", "AC", ...]

// Avances Destajos
"avance:uuid-456" → { avance_id, obra_id, ... }
"avance:index:obra:228:semana:5:2025" → ["uuid-1", "uuid-2", ...]
```

### Ventajas del KV Store:
✅ No requiere migraciones DDL  
✅ Flexible para prototipos  
✅ Rápido para desarrollo  
✅ Compatible con el sistema actual  

---

**Documento creado:** 2025-02-09  
**Versión:** 1.0  
**Estado:** ✅ Completo y listo para implementación
