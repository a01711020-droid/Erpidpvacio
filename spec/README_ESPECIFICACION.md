# 📋 ESPECIFICACIÓN DE DATOS - ERP IDP

## 🎯 PROPÓSITO

Este directorio contiene las **especificaciones de datos** del sistema ERP.  
Son la **fuente de verdad** para definir la estructura de información que maneja el sistema.

**IMPORTANTE:** Estos archivos JSON son **especificación pura**, no código ejecutable.

---

## 📁 ESTRUCTURA

```
/spec
├── obras/
│   ├── obra.schema.json          # Esquema JSON de Obra
│   └── obra.example.json         # Ejemplos de obras
│
├── proveedores/
│   ├── proveedor.schema.json     # Esquema JSON de Proveedor
│   └── proveedor.example.json    # Ejemplos de proveedores
│
├── compras/
│   ├── orden_compra.schema.json  # Esquema JSON de Orden de Compra
│   └── orden_compra.example.json # Ejemplos de OCs
│
├── pagos/
│   ├── pago.schema.json          # Esquema JSON de Pago
│   └── pago.example.json         # Ejemplos de pagos
│
└── dashboard/
    ├── metricas_obra.schema.json # Esquema de métricas calculadas
    └── metricas_obra.example.json # Ejemplos de métricas
```

---

## 🔧 USO DE ARCHIVOS

### `*.schema.json`
- **Qué es:** Definición formal del esquema de datos (JSON Schema)
- **Para qué sirve:** 
  - Documentar la estructura de datos
  - Generar tipos TypeScript
  - Validar datos en backend
  - Referencia para desarrolladores
- **NO es:** Código ejecutable

### `*.example.json`
- **Qué es:** Ejemplos realistas de datos
- **Para qué sirve:**
  - Mock data para desarrollo frontend
  - Testing de componentes visuales
  - Documentación por ejemplo
  - Referencia de datos reales
- **NO es:** Base de datos

---

## 📊 ENTIDADES PRINCIPALES

### 1. Obra
**Archivo:** `/spec/obras/obra.schema.json`

**Descripción:** Proyecto de construcción  
**Tabla SQL:** `obras`

**Campos principales:**
```typescript
{
  obra_id: UUID,
  codigo_obra: string,        // "227", "228"
  nombre_obra: string,        // "CASTELLO E"
  numero_contrato: string,
  cliente: string,
  residente: string,
  monto_contratado: number,
  fecha_inicio: date,
  fecha_fin_programada: date,
  estado: enum
}
```

---

### 2. Proveedor
**Archivo:** `/spec/proveedores/proveedor.schema.json`

**Descripción:** Proveedor de materiales/servicios  
**Tabla SQL:** `proveedores`

**Campos principales:**
```typescript
{
  proveedor_id: UUID,
  nombre_comercial: string,   // "CEMEX", "LEVINSON"
  razon_social: string,       // Nombre legal completo
  rfc: string,                // RFC fiscal
  direccion: string,
  telefono: string,
  email: string,
  banco: string,
  clabe: string,              // 18 dígitos
  dias_credito: integer,      // Días de crédito otorgados
  limite_credito: number
}
```

---

### 3. Orden de Compra
**Archivo:** `/spec/compras/orden_compra.schema.json`

**Descripción:** Orden de compra de materiales/servicios  
**Tabla SQL:** `ordenes_compra` + `orden_compra_items`

**Campos principales:**
```typescript
{
  orden_compra_id: UUID,
  folio: string,              // "227-A01GM-CEMEX"
  obra_id: UUID,              // FK a obras
  proveedor_id: UUID,         // FK a proveedores
  fecha_emision: date,
  fecha_entrega: date,
  estado: enum,               // borrador, emitida, parcialmente_pagada, pagada
  subtotal: number,
  descuento_porcentaje: number,
  descuento_monto: number,
  iva: number,
  total: number,
  monto_pagado: number,       // Acumulado de pagos
  saldo_pendiente: number,    // total - monto_pagado
  items: ItemOrdenCompra[]
}
```

**Formato de Folio:**
```
XXX-ANNII-PROVEEDOR
│   │││││  └─ Nombre comercial del proveedor
│   │││││
│   │││└└─ Iniciales del comprador
│   ││└─── Número secuencial (01, 02, 03...)
│   │└──── Tipo: A=Material, B=Servicio, C=Renta
│   └───── Código de obra
└─────── Separador
```

**Estados de OC:**
- `borrador` - En proceso de creación
- `emitida` - Enviada al proveedor, no pagada
- `parcialmente_pagada` - Con al menos un pago parcial
- `pagada` - Completamente pagada
- `cancelada` - Cancelada

---

### 4. Pago
**Archivo:** `/spec/pagos/pago.schema.json`

**Descripción:** Pago a proveedor (puede ser parcial o total)  
**Tabla SQL:** `pagos`

**Campos principales:**
```typescript
{
  pago_id: UUID,
  folio_pago: string,         // "PAG-227-001" o "PAG-227-001-P1" (parcial)
  orden_compra_id: UUID,      // FK a ordenes_compra
  obra_id: UUID,              // Denormalizado para consultas
  proveedor_id: UUID,         // Denormalizado para consultas
  tipo_pago: enum,            // "total" o "parcial"
  numero_parcialidad: integer | null,
  monto_pago: number,         // Monto de ESTE pago
  metodo_pago: enum,          // transferencia, cheque, efectivo
  fecha_programada: date,
  fecha_procesado: datetime | null,
  semana_fiscal: integer,     // 1-53
  estado: enum,               // programado, procesando, completado, cancelado
  referencia_bancaria: string | null,
  comprobante_url: string | null,
  requiere_factura: boolean,
  factura_recibida: boolean
}
```

**Formato de Folio:**
```
PAG-XXX-NNN[-PN]
│   │   │   └─ Parcialidad (opcional): P1, P2, P3...
│   │   └───── Número secuencial
│   └───────── Código de obra
└─────────── Prefijo
```

**Estados de Pago:**
- `programado` - Pago agendado, no ejecutado
- `procesando` - En proceso de ejecución
- `completado` - Pago realizado con éxito
- `cancelado` - Pago cancelado

---

### 5. Métricas de Obra
**Archivo:** `/spec/dashboard/metricas_obra.schema.json`

**Descripción:** Métricas calculadas para el dashboard  
**Fuente:** Calculado en backend desde múltiples tablas

**Campos principales:**
```typescript
{
  obra_id: UUID,
  codigo_obra: string,
  nombre_obra: string,
  
  // Montos
  monto_contratado: number,      // Original + aditivas - deductivas
  monto_comprometido: number,    // Sum OCs emitidas
  monto_pagado: number,          // Sum pagos completados
  saldo_disponible: number,      // contratado - comprometido
  
  // Porcentajes
  porcentaje_ejercido: number,   // (comprometido / contratado) * 100
  avance_fisico_porcentaje: number,  // Según estimaciones
  
  // Estado
  estado_financiero: enum,       // saludable | advertencia | critico
  
  // Tiempo
  dias_transcurridos: integer,
  dias_restantes: integer,
  porcentaje_tiempo_transcurrido: number
}
```

**Reglas de Estado Financiero:**
```
saludable:   porcentaje_ejercido < 75%
advertencia: 75% ≤ porcentaje_ejercido < 90%
critico:     porcentaje_ejercido ≥ 90%
```

---

## 🎨 NOMENCLATURA SQL-STYLE

### Nombres de Campos
✅ **USAR:**
```
obra_id
codigo_obra
nombre_obra
monto_contratado
fecha_emision
estado_financiero
```

❌ **NO USAR:**
```
workId
codeWork
workName
contractedAmount
issueDate
financialStatus
```

### Separadores
- **Guión bajo `_`** para campos de base de datos
- **camelCase** solo en TypeScript si es necesario
- **kebab-case** para IDs de HTML/CSS

### Convenciones de Nombres
```
{entidad}_id       # IDs primarios (obra_id, proveedor_id)
{entidad}_{campo}  # Campos específicos (orden_compra_id, fecha_emision)
monto_{tipo}       # Montos (monto_contratado, monto_pagado)
fecha_{evento}     # Fechas (fecha_inicio, fecha_entrega)
```

---

## 🔗 RELACIONES ENTRE ENTIDADES

```
Obra (1) ──┬─→ (N) OrdenCompra
           ├─→ (N) Pago
           └─→ (N) Requisicion

Proveedor (1) ──┬─→ (N) OrdenCompra
                └─→ (N) Pago

OrdenCompra (1) ──┬─→ (N) ItemOrdenCompra
                  └─→ (N) Pago

Requisicion (1) ──→ (0..1) OrdenCompra
```

---

## 📐 CÁLCULOS IMPORTANTES

### Monto Contratado Actualizado
```
monto_contratado = monto_original + total_aditivas - total_deductivas
```

### Saldo Disponible
```
saldo_disponible = monto_contratado - monto_comprometido
```

### Monto Comprometido
```
monto_comprometido = SUM(ordenes_compra.total WHERE estado IN ['emitida', 'parcialmente_pagada', 'pagada'])
```

### Saldo Pendiente de OC
```
saldo_pendiente = orden_compra.total - orden_compra.monto_pagado
```

### Monto Pagado de OC
```
monto_pagado = SUM(pagos.monto_pago WHERE orden_compra_id = X AND estado = 'completado')
```

---

## 🚦 ESTADOS Y TRANSICIONES

### Orden de Compra
```
borrador → emitida → parcialmente_pagada → pagada
                  ↓
              cancelada
```

### Pago
```
programado → procesando → completado
          ↓
      cancelado
```

### Obra
```
activa → suspendida → activa
      ↓           ↓
   terminada   cancelada
```

---

## 💡 GUÍA DE USO PARA DESARROLLADORES

### Backend (FastAPI)
1. Usar schemas para validación con Pydantic
2. Usar example.json para testing
3. Mantener nombres de campos idénticos a SQL

### Frontend (React)
1. Usar schemas para generar tipos TypeScript
2. Usar example.json como mock data visual
3. NO calcular métricas en frontend (vienen del backend)

### Base de Datos (PostgreSQL)
1. Crear tablas según schemas
2. Usar CHECK constraints para enums
3. Implementar triggers para cálculos automáticos

---

## 📝 FORMATO ESTÁNDAR

### Fechas
- **Schema:** `YYYY-MM-DD` (ISO 8601 date)
- **Ejemplo:** `"2024-01-15"`

### Fechas y Horas
- **Schema:** `YYYY-MM-DDThh:mm:ssZ` (ISO 8601 datetime)
- **Ejemplo:** `"2024-01-15T14:30:00Z"`

### Montos
- **Tipo:** `number` (decimales)
- **Precisión:** 2 decimales
- **Ejemplo:** `15000000.00`

### UUIDs
- **Formato:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Ejemplo:** `"550e8400-e29b-41d4-a716-446655440001"`

---

## 🔄 PROCESO DE ACTUALIZACIÓN

### Cuando agregar/modificar un campo:

1. **Actualizar schema.json**
   - Agregar campo con tipo, descripción y validaciones
   - Actualizar `required` si aplica

2. **Actualizar example.json**
   - Agregar valores realistas en todos los ejemplos
   - Mantener consistencia de datos

3. **Documentar en este README**
   - Agregar a la sección de la entidad
   - Explicar propósito y uso

4. **Notificar a los equipos**
   - Backend: Actualizar modelos Pydantic
   - Frontend: Regenerar tipos TypeScript
   - Database: Crear migration

---

## 📚 RECURSOS ADICIONALES

- [JSON Schema Docs](https://json-schema.org/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [ISO 8601 Date/Time](https://www.iso.org/iso-8601-date-and-time-format.html)

---

**Última actualización:** 2025-01-24  
**Mantenido por:** Equipo de Desarrollo IDP
