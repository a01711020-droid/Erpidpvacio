# 📋 MÓDULO REQUISICIONES - Solicitudes de Material

## 🎯 PROPÓSITO

El módulo de Requisiciones es donde:
- Los **residentes de obra** solicitan materiales necesarios
- Los **almacenistas** gestionan las solicitudes
- Se documenta qué material se necesita y para qué obra
- Se inicia el flujo de compra (Requisición → Orden de Compra)

**Usuarios:** Residente de Obra, Almacenista, Administrador

---

## 📥 INFORMACIÓN QUE NECESITA (INPUTS)

### 1. **Obra Activa (Pre-requisito)**
```typescript
// La obra DEBE existir primero (creada en Dashboard)
{
  obra_id: "uuid-228",
  codigo_obra: "228",
  nombre_obra: "CASTELLO TORRE F/G/H",
  estado: "activa"  // ← Debe estar activa
}
```
⚠️ **SIN OBRA = NO HAY REQUISICIONES**

### 2. **Datos de la Requisición**
```typescript
{
  // OBLIGATORIO - A qué obra pertenece
  obra_id: "uuid-228",
  
  // Información de la solicitud
  folio: "REQ-228-001",                  // Generado automático
  solicitante: "Ing. Carlos Méndez",     // Quién solicita
  fecha_solicitud: "2025-02-09",         // Cuándo se crea
  fecha_requerida: "2025-02-12",         // Cuándo se necesita
  
  // Justificación
  motivo: "Material para losa N1",       // Por qué se necesita
  observaciones: "Urgente - obra parada", // Notas adicionales
  
  // Estado
  estado: "pendiente"  // pendiente | aprobada | rechazada | enviada_compras
}
```

### 3. **Items Solicitados**
```typescript
items: [
  {
    item_id: "uuid-item-1",
    requisicion_id: "uuid-req-1",
    descripcion: "Cemento CPC 30R",
    unidad: "Bulto",
    cantidad_solicitada: 150,
    especificaciones: "Bultos de 50kg marca CEMEX"
  },
  {
    item_id: "uuid-item-2",
    requisicion_id: "uuid-req-1",
    descripcion: "Acero corrugado 3/8",
    unidad: "Varilla",
    cantidad_solicitada: 200,
    especificaciones: "Varillas de 12m"
  }
]
```

---

## 📤 INFORMACIÓN QUE CREA (OUTPUTS)

### 1. **REQUISICIÓN (Entidad Principal)**

```typescript
// Se guarda en KV Store
Clave: "requisicion:uuid-req-001"

Valor: {
  requisicion_id: "uuid-req-001",
  obra_id: "uuid-228",               // ← Relacionada con obra
  folio: "REQ-228-001",
  solicitante: "Ing. Carlos Méndez",
  fecha_solicitud: "2025-02-09",
  fecha_requerida: "2025-02-12",
  motivo: "Material para losa N1",
  estado: "pendiente",
  created_at: "2025-02-09T08:30:00Z",
  updated_at: "2025-02-09T08:30:00Z"
}
```

### 2. **Items de la Requisición**

```typescript
// Se guardan por separado (relación 1:N)
Clave: "item_requisicion:uuid-item-1"

Valor: {
  item_id: "uuid-item-1",
  requisicion_id: "uuid-req-001",    // ← Relacionado con requisición
  descripcion: "Cemento CPC 30R",
  unidad: "Bulto",
  cantidad_solicitada: 150,
  especificaciones: "Bultos de 50kg marca CEMEX",
  created_at: "2025-02-09T08:30:00Z"
}
```

### 3. **¿Qué Habilita Esto?**

✅ **Para el Módulo de Compras:**
- La requisición aparece como "Por Atender"
- Comprador puede convertirla en Orden de Compra
- Comprador ve qué materiales se necesitan y para qué obra

✅ **Para el Dashboard:**
- Gerente ve cuántas requisiciones hay por obra
- Métricas: "15 requisiciones activas en obra 228"
- Estado de la obra más completo

---

## 🔄 FLUJO OPERATIVO

### PASO 1: Verificar que existe la Obra
```
Usuario Residente abre Requisiciones
    ↓
[Loading] → GET /api/obras
    ↓
[Validar] → ¿Hay obras activas?
    ↓
SÍ → Mostrar selector de obras
NO → "No hay obras disponibles. Contacta a gerencia."
```

### PASO 2: Crear Nueva Requisición
```
Usuario hace clic en "Nueva Requisición"
    ↓
[Formulario]
    ├─ Selector de Obra → obra_id
    ├─ Solicitante → auto-llenado con nombre usuario
    ├─ Fecha requerida → calendario
    └─ Motivo → textarea
    ↓
[Agregar Items]
    ├─ Descripción del material
    ├─ Unidad (Pza, Bulto, M3, etc)
    ├─ Cantidad
    └─ Especificaciones
    ↓
[Botón "Agregar Otro Item"] → repite
    ↓
[Guardar Requisición]
    ├─ POST /api/requisiciones → Crea requisición
    └─ POST /api/requisiciones/:id/items → Crea cada item
    ↓
[Success] → Folio generado: REQ-228-001
```

### PASO 3: Listar Requisiciones
```
Usuario abre lista de requisiciones
    ↓
[Loading] → GET /api/requisiciones
    ↓
[Filtrar por Obra] → Si usuario tiene obras asignadas
    ↓
[Mostrar]:
    ├─ Estado: Pendiente (amarillo)
    ├─ Estado: Aprobada (verde)
    ├─ Estado: Enviada a Compras (azul)
    └─ Estado: Rechazada (rojo)
```

### PASO 4: Ver Detalle de Requisición
```
Usuario hace clic en REQ-228-001
    ↓
[Loading] 
    ├─ GET /api/requisiciones/:id → Info general
    └─ GET /api/requisiciones/:id/items → Lista de items
    ↓
[Mostrar]:
    ├─ Folio: REQ-228-001
    ├─ Obra: CASTELLO F/G/H (228)
    ├─ Solicitante: Ing. Carlos Méndez
    ├─ Fecha: 09-Feb-2025
    ├─ Estado: Pendiente
    ├─ Items:
    │   • Cemento CPC 30R - 150 bultos
    │   • Acero corrugado 3/8 - 200 varillas
    └─ Observaciones: "Urgente - obra parada"
```

---

## 📊 PANTALLAS DEL MÓDULO

### 1. **Lista de Requisiciones** (`/requisiciones`)

```
┌────────────────────────────────────────────┐
│  📋 Requisiciones de Material              │
├────────────────────────────────────────────┤
│                                            │
│  Obra: [Selector: CASTELLO F/G/H ▼]       │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ REQ-228-001                          │ │
│  │ Obra: CASTELLO F/G/H (228)           │ │
│  │ Solicitante: Ing. Carlos Méndez      │ │
│  │ Fecha: 09-Feb-2025                   │ │
│  │ Items: 2 materiales                  │ │
│  │ Estado: 🟡 Pendiente                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ REQ-228-002                          │ │
│  │ Obra: CASTELLO F/G/H (228)           │ │
│  │ Solicitante: Ing. Carlos Méndez      │ │
│  │ Fecha: 10-Feb-2025                   │ │
│  │ Items: 5 materiales                  │ │
│  │ Estado: 🟢 Aprobada                  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Nueva Requisición]                     │
│                                            │
└────────────────────────────────────────────┘
```

### 2. **Nueva Requisición** (`/requisiciones/nueva`)

```
┌────────────────────────────────────────────┐
│  📋 Nueva Requisición de Material          │
├────────────────────────────────────────────┤
│                                            │
│  Información General:                      │
│  ┌──────────────────────────────────────┐ │
│  │ Obra: [CASTELLO F/G/H (228) ▼]      │ │
│  │                                      │ │
│  │ Solicitante: Ing. Carlos Méndez     │ │
│  │                                      │ │
│  │ Fecha Requerida: [12-Feb-2025 📅]   │ │
│  │                                      │ │
│  │ Motivo:                              │ │
│  │ [Material para losa N1____________]  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Items Solicitados:                        │
│  ┌──────────────────────────────────────┐ │
│  │ 1. Cemento CPC 30R                   │ │
│  │    Unidad: Bulto | Cantidad: 150    │ │
│  │    Especificaciones: 50kg CEMEX     │ │
│  │    [Eliminar]                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 2. Acero corrugado 3/8               │ │
│  │    Unidad: Varilla | Cantidad: 200  │ │
│  │    Especificaciones: 12m            │ │
│  │    [Eliminar]                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Agregar Item]                          │
│                                            │
│  Observaciones:                            │
│  [Urgente - obra parada_______________]   │
│                                            │
│  [Cancelar]  [Guardar Requisición]         │
│                                            │
└────────────────────────────────────────────┘
```

### 3. **Detalle de Requisición** (`/requisiciones/:id`)

```
┌────────────────────────────────────────────┐
│  📋 Requisición REQ-228-001                │
├────────────────────────────────────────────┤
│                                            │
│  Información:                              │
│  Obra: CASTELLO TORRE F/G/H (228)          │
│  Solicitante: Ing. Carlos Méndez           │
│  Fecha Solicitud: 09-Feb-2025              │
│  Fecha Requerida: 12-Feb-2025              │
│  Estado: 🟡 Pendiente                      │
│                                            │
│  Motivo:                                   │
│  Material para construcción de losa N1     │
│                                            │
│  Items:                                    │
│  ┌──────────────────────────────────────┐ │
│  │ 1. Cemento CPC 30R                   │ │
│  │    150 Bultos                        │ │
│  │    Especif: Bultos 50kg marca CEMEX │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 2. Acero corrugado 3/8               │ │
│  │    200 Varillas                      │ │
│  │    Especif: Varillas de 12m         │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Observaciones:                            │
│  Urgente - obra parada                     │
│                                            │
│  [Editar]  [Eliminar]  [Enviar a Compras]  │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔗 RELACIONES CON OTROS MÓDULOS

### Dashboard → Requisiciones
```
Dashboard CREA obra 228
    ↓
Requisiciones VE obra 228 en selector
    ↓
✅ Puede crear requisiciones para esa obra
```

### Requisiciones → Compras
```
Requisiciones CREA REQ-228-001
    ↓
Estado: "Enviada a Compras"
    ↓
Compras VE la requisición
    ↓
Compras CREA orden de compra basada en requisición
    ↓
Orden de Compra tiene:
    ├─ obra_id = "uuid-228" (misma obra)
    ├─ requisicion_origen_id = "uuid-req-001"
    └─ items copiados de la requisición
```

### Requisiciones → Dashboard (lectura)
```
Requisiciones CREA 5 requisiciones en obra 228
    ↓
Dashboard LEE requisiciones de obra 228
    ↓
Dashboard MUESTRA: "5 requisiciones activas"
```

---

## 🎯 ESTADOS DEL MÓDULO

### Estado 1: EMPTY (Sin Obras)
```
┌────────────────────────────────────────────┐
│                                            │
│     📋 Requisiciones de Material           │
│                                            │
│    No hay obras disponibles                │
│                                            │
│    Por favor contacta a gerencia para      │
│    que creen obras en el sistema.          │
│                                            │
└────────────────────────────────────────────┘
```

### Estado 2: EMPTY (Sin Requisiciones)
```
┌────────────────────────────────────────────┐
│                                            │
│     📋 Requisiciones de Material           │
│                                            │
│    Obra: CASTELLO F/G/H (228)              │
│                                            │
│    No hay requisiciones creadas            │
│                                            │
│    [+ Nueva Requisición]                   │
│                                            │
└────────────────────────────────────────────┘
```

### Estado 3: LOADING
```
┌────────────────────────────────────────────┐
│                                            │
│     📋 Requisiciones de Material           │
│                                            │
│    ⏳ Cargando requisiciones...            │
│                                            │
└────────────────────────────────────────────┘
```

### Estado 4: WITH DATA
```
[Ver diseño completo arriba]
```

---

## 📋 REGLAS DE NEGOCIO

### ✅ Al Crear Requisición:

1. **Obra obligatoria** - Debe seleccionar una obra activa
2. **Folio único** - Se genera automático: `REQ-{codigo_obra}-{secuencial}`
3. **Mínimo 1 item** - No se puede guardar sin items
4. **Fecha requerida futura** - Debe ser >= fecha actual
5. **Estado inicial** - Siempre "pendiente"

### ✅ Generación de Folio:
```typescript
// Algoritmo de folio
const codigoObra = "228";
const requisicionesObra = await getRequisicionesByObra(obraId);
const secuencial = requisicionesObra.length + 1;
const folio = `REQ-${codigoObra}-${secuencial.toString().padStart(3, '0')}`;

// Resultado: REQ-228-001, REQ-228-002, etc.
```

### ✅ Estados de la Requisición:
- **Pendiente** 🟡 - Recién creada, esperando revisión
- **Aprobada** 🟢 - Revisada y aprobada, lista para compras
- **Enviada a Compras** 🔵 - Ya fue enviada al módulo de compras
- **Rechazada** 🔴 - No aprobada (con motivo de rechazo)

### ⚠️ Validaciones:
- No se puede editar una requisición "Enviada a Compras"
- No se puede eliminar una requisición con orden de compra asociada
- Fecha requerida no puede ser más de 90 días en el futuro

---

## 🔧 API QUE USA

```typescript
import { 
  obrasApi,               // Leer obras para selector
  requisicionesApi,       // CRUD de requisiciones
  itemsRequisicionApi    // CRUD de items
} from '@/app/utils/api';
```

### Llamadas Típicas:

**Cargar obras disponibles:**
```typescript
const response = await obrasApi.getAll();
const obrasActivas = response.data.filter(o => o.estado === 'activa');
```

**Crear requisición:**
```typescript
// 1. Crear cabecera
const requisicion = await requisicionesApi.create({
  obra_id: "uuid-228",
  solicitante: "Ing. Carlos Méndez",
  fecha_requerida: "2025-02-12",
  motivo: "Material para losa N1",
  estado: "pendiente"
});

// 2. Crear items
for (const item of items) {
  await itemsRequisicionApi.create(requisicion.requisicion_id, {
    descripcion: item.descripcion,
    unidad: item.unidad,
    cantidad_solicitada: item.cantidad,
    especificaciones: item.especificaciones
  });
}
```

**Leer requisiciones de una obra:**
```typescript
const response = await requisicionesApi.getByObra("uuid-228");
const requisiciones = response.data;
```

**Actualizar estado:**
```typescript
await requisicionesApi.updateStatus(
  "uuid-req-001", 
  "enviada_compras"
);
```

---

## 📊 EJEMPLO COMPLETO DE USO

### Día 1: Residente crea requisición
```
Usuario: Ing. Carlos Méndez (Residente)
Obra: CASTELLO F/G/H (228)

1. Abre módulo Requisiciones
2. Ve obra 228 en selector (porque existe en Dashboard)
3. Clic en "Nueva Requisición"
4. Selecciona obra: 228
5. Fecha requerida: 12-Feb-2025
6. Motivo: "Material para losa N1"
7. Agrega items:
   - Cemento CPC 30R - 150 bultos
   - Acero corrugado 3/8 - 200 varillas
8. Observaciones: "Urgente - obra parada"
9. Clic en "Guardar"

Resultado:
✅ Requisición REQ-228-001 creada
✅ Estado: Pendiente
✅ Aparece en lista de requisiciones
```

### Día 2: Almacenista revisa y aprueba
```
Usuario: José López (Almacenista)

1. Abre módulo Requisiciones
2. Ve REQ-228-001 en lista
3. Clic en "Ver Detalle"
4. Revisa items y cantidades
5. Clic en "Aprobar"

Resultado:
✅ Estado cambia a "Aprobada"
✅ Queda lista para enviarse a Compras
```

### Día 3: Se envía a Compras
```
Usuario: Ing. Carlos Méndez (Residente)

1. Abre REQ-228-001
2. Clic en "Enviar a Compras"
3. Confirmación

Resultado:
✅ Estado: "Enviada a Compras"
✅ Módulo Compras puede verla
✅ Ya no se puede editar
```

---

## 🎯 PUNTO CLAVE

**LA REQUISICIÓN ES EL ORIGEN DE TODO:**

```
REQUISICIÓN
    ↓
ORDEN DE COMPRA
    ↓
FACTURA
    ↓
PAGO
```

Sin requisición, no hay solicitud formal de material.  
Sin solicitud formal, no hay compra autorizada.

---

**Documento creado:** 2025-02-09  
**Módulo:** Requisiciones  
**Rol:** Residente/Almacenista - Solicita materiales para obras
