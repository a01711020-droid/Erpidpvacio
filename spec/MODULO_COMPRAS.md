# 🛒 MÓDULO COMPRAS - Gestión de Órdenes de Compra

## 🎯 PROPÓSITO

El módulo de Compras es donde:
- Los **compradores** gestionan proveedores
- Se crean **órdenes de compra** (OC) basadas en requisiciones
- Se formalizan las compras de materiales para las obras
- Se genera el compromiso de pago (COMPRAR ≠ PAGAR)

**Usuarios:** Comprador, Administrador

---

## 📥 INFORMACIÓN QUE NECESITA (INPUTS)

### 1. **Obra Activa (Pre-requisito)**
```typescript
// La obra DEBE existir (creada en Dashboard)
{
  obra_id: "uuid-228",
  codigo_obra: "228",
  nombre_obra: "CASTELLO TORRE F/G/H",
  estado: "activa"
}
```

### 2. **Proveedor Registrado**
```typescript
{
  proveedor_id: "uuid-prov-123",
  razon_social: "CEMEX MÉXICO",
  rfc: "CEM920325XX1",
  nombre_comercial: "CEMEX",
  contacto: "Lic. Roberto Gómez",
  telefono: "8112345678",
  email: "ventas@cemex.com",
  direccion: "Av. Constitución 444, Monterrey",
  dias_credito: 30,               // Días para pagar
  activo: true
}
```

### 3. **Requisición (Opcional pero Común)**
```typescript
// La OC puede basarse en una requisición
{
  requisicion_id: "uuid-req-001",
  folio: "REQ-228-001",
  items: [
    {
      descripcion: "Cemento CPC 30R",
      cantidad_solicitada: 150,
      unidad: "Bulto"
    }
  ]
}
```

### 4. **Datos de la Orden de Compra**
```typescript
{
  // OBLIGATORIO
  obra_id: "uuid-228",                    // A qué obra
  proveedor_id: "uuid-prov-123",          // A quién se compra
  
  // Folio generado
  folio: "228-A01GM-CEMEX",               // Auto-generado
  
  // Fechas
  fecha_orden: "2025-02-09",              // Cuándo se crea
  fecha_entrega_estimada: "2025-02-12",   // Cuándo llega
  
  // Origen (opcional)
  requisicion_origen_id: "uuid-req-001",  // Si viene de requisición
  
  // Items y montos
  items: [...],                           // Productos a comprar
  subtotal: 42000,                        // Antes de IVA
  iva: 6720,                              // 16%
  monto_total: 48720,                     // Subtotal + IVA
  
  // Condiciones
  condiciones_pago: "30 días",
  metodo_entrega: "Entrega en obra",
  
  // Estado
  estado: "pendiente"  // pendiente | autorizada | recibida | cancelada
}
```

### 5. **Items de la Orden**
```typescript
items: [
  {
    item_id: "uuid-item-oc-1",
    orden_id: "uuid-oc-123",
    descripcion: "Cemento CPC 30R",
    unidad: "Bulto",
    cantidad: 150,
    precio_unitario: 280,
    subtotal: 42000,                    // cantidad × precio_unitario
    iva: 6720,
    total: 48720
  }
]
```

---

## 📤 INFORMACIÓN QUE CREA (OUTPUTS)

### 1. **PROVEEDOR**

```typescript
// Se guarda en KV Store
Clave: "proveedor:uuid-prov-123"

Valor: {
  proveedor_id: "uuid-prov-123",
  razon_social: "CEMEX MÉXICO",
  rfc: "CEM920325XX1",
  nombre_comercial: "CEMEX",
  contacto: "Lic. Roberto Gómez",
  telefono: "8112345678",
  email: "ventas@cemex.com",
  dias_credito: 30,
  activo: true,
  created_at: "2025-02-09T09:00:00Z",
  updated_at: "2025-02-09T09:00:00Z"
}
```

### 2. **ORDEN DE COMPRA (Entidad Principal)**

```typescript
// Se guarda en KV Store
Clave: "orden_compra:uuid-oc-123"

Valor: {
  orden_id: "uuid-oc-123",
  obra_id: "uuid-228",               // ← Relacionada con obra
  proveedor_id: "uuid-prov-123",     // ← Relacionada con proveedor
  folio: "228-A01GM-CEMEX",
  fecha_orden: "2025-02-09",
  fecha_entrega_estimada: "2025-02-12",
  requisicion_origen_id: "uuid-req-001", // ← Relacionada con requisición
  subtotal: 42000,
  iva: 6720,
  monto_total: 48720,
  condiciones_pago: "30 días",
  estado: "pendiente",
  created_at: "2025-02-09T10:00:00Z",
  updated_at: "2025-02-09T10:00:00Z"
}
```

### 3. **¿Qué Habilita Esto?**

✅ **Para el Módulo de Pagos:**
- La OC genera un COMPROMISO de pago
- Cuando llega la factura del proveedor, se vincula a esta OC
- Pagos ve: "OC 228-A01GM-CEMEX por $48,720 - Pendiente de pago"

✅ **Para el Dashboard:**
- Dashboard ve: "Gastado en obra 228: $48,720"
- Métricas: "% de presupuesto ejercido"
- Obra 228 tiene $48,720 comprometidos pero NO pagados

✅ **Para la Requisición:**
- Requisición cambia estado a: "Atendida por OC 228-A01GM-CEMEX"
- Se cierra el ciclo: Solicitud → Compra

---

## 🔄 FLUJO OPERATIVO

### PASO 1: Gestión de Proveedores

```
Usuario Comprador abre módulo Compras
    ↓
[Tab Proveedores]
    ↓
[Ver Lista] → GET /api/proveedores
    ↓
¿Existe el proveedor que necesito?
    ├─ SÍ → Usar existente
    └─ NO → Crear nuevo
        ↓
        [Formulario Nuevo Proveedor]
            ├─ Razón Social
            ├─ RFC
            ├─ Contacto
            ├─ Teléfono
            ├─ Email
            └─ Días de Crédito
        ↓
        POST /api/proveedores
        ↓
        Proveedor disponible en sistema
```

### PASO 2: Crear Orden de Compra (Flujo Manual)

```
Usuario clic en "Nueva Orden de Compra"
    ↓
[Formulario]
    ├─ Selector de Obra → obra_id
    ├─ Selector de Proveedor → proveedor_id
    ├─ Fecha Entrega Estimada
    └─ Condiciones de Pago
    ↓
[Agregar Items]
    ├─ Descripción del producto
    ├─ Unidad
    ├─ Cantidad
    ├─ Precio Unitario
    └─ Sistema calcula: Subtotal, IVA, Total
    ↓
[Agregar más items...] → repetir
    ↓
[Sistema calcula totales]
    ├─ Suma todos los subtotales
    ├─ Calcula IVA (16%)
    └─ Calcula Total
    ↓
[Guardar]
    ├─ POST /api/ordenes-compra → Crea OC
    └─ Genera folio: 228-A01GM-CEMEX
    ↓
[Success] → OC creada y disponible
```

### PASO 3: Crear OC desde Requisición (Flujo Automatizado)

```
Usuario abre lista de requisiciones "Aprobadas"
    ↓
[Ve] REQ-228-001 con estado "Aprobada"
    ↓
[Clic] "Convertir a Orden de Compra"
    ↓
[Formulario Pre-llenado]
    ├─ Obra: Ya viene de la requisición
    ├─ Items: Ya vienen de la requisición
    ├─ Usuario solo elige:
    │   ├─ Proveedor
    │   ├─ Precios unitarios
    │   └─ Fecha entrega
    ↓
[Sistema calcula montos automáticamente]
    ↓
[Guardar]
    ├─ POST /api/ordenes-compra
    ├─ requisicion_origen_id = REQ-228-001
    └─ Actualiza requisición: estado = "atendida"
    ↓
[Success] → OC creada desde requisición
```

### PASO 4: Autorizar/Recibir Orden

```
Usuario abre detalle de OC
    ↓
[Acciones disponibles según estado]
    ├─ Pendiente → [Autorizar] [Cancelar]
    ├─ Autorizada → [Marcar como Recibida]
    └─ Recibida → [Ver Historial]
    ↓
[Clic en acción]
    ↓
PUT /api/ordenes-compra/:id/status
    ↓
[Actualiza estado]
```

---

## 📊 PANTALLAS DEL MÓDULO

### 1. **Lista de Órdenes de Compra** (`/compras/ordenes`)

```
┌────────────────────────────────────────────┐
│  🛒 Órdenes de Compra                      │
├────────────────────────────────────────────┤
│                                            │
│  Obra: [CASTELLO F/G/H (228) ▼]           │
│  Estado: [Todas ▼]                         │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 228-A01GM-CEMEX                      │ │
│  │ Proveedor: CEMEX MÉXICO              │ │
│  │ Monto: $48,720.00                    │ │
│  │ Fecha: 09-Feb-2025                   │ │
│  │ Entrega: 12-Feb-2025                 │ │
│  │ Estado: 🟡 Pendiente                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 228-A02GM-ACEROS                     │ │
│  │ Proveedor: Aceros del Norte          │ │
│  │ Monto: $125,600.00                   │ │
│  │ Fecha: 08-Feb-2025                   │ │
│  │ Entrega: 11-Feb-2025                 │ │
│  │ Estado: 🟢 Autorizada                │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Nueva Orden de Compra]                 │
│                                            │
└────────────────────────────────────────────┘
```

### 2. **Nueva Orden de Compra** (`/compras/ordenes/nueva`)

```
┌────────────────────────────────────────────┐
│  🛒 Nueva Orden de Compra                  │
├────────────────────────────────────────────┤
│                                            │
│  Información General:                      │
│  ┌──────────────────────────────────────┐ │
│  │ Obra: [CASTELLO F/G/H (228) ▼]      │ │
│  │                                      │ │
│  │ Proveedor: [CEMEX MÉXICO ▼]         │ │
│  │                                      │ │
│  │ Fecha Entrega: [12-Feb-2025 📅]     │ │
│  │                                      │ │
│  │ Condiciones: [30 días_____________] │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Items a Comprar:                          │
│  ┌──────────────────────────────────────┐ │
│  │ 1. Cemento CPC 30R                   │ │
│  │    150 Bultos × $280 = $42,000      │ │
│  │    [Eliminar]                        │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Agregar Item]                          │
│                                            │
│  Totales:                                  │
│  ┌──────────────────────────────────────┐ │
│  │ Subtotal:    $42,000.00              │ │
│  │ IVA (16%):   $6,720.00               │ │
│  │ ──────────────────────────────       │ │
│  │ TOTAL:       $48,720.00              │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [Cancelar]  [Guardar Orden]               │
│                                            │
└────────────────────────────────────────────┘
```

### 3. **Detalle de Orden** (`/compras/ordenes/:id`)

```
┌────────────────────────────────────────────┐
│  🛒 Orden de Compra 228-A01GM-CEMEX        │
├────────────────────────────────────────────┤
│                                            │
│  Información:                              │
│  Obra: CASTELLO TORRE F/G/H (228)          │
│  Proveedor: CEMEX MÉXICO                   │
│  RFC: CEM920325XX1                         │
│  Contacto: Lic. Roberto Gómez              │
│  Tel: 8112345678                           │
│                                            │
│  Fechas:                                   │
│  Orden: 09-Feb-2025                        │
│  Entrega Estimada: 12-Feb-2025             │
│                                            │
│  Condiciones:                              │
│  Pago: 30 días                             │
│  Entrega: En obra                          │
│                                            │
│  Items:                                    │
│  ┌──────────────────────────────────────┐ │
│  │ Cemento CPC 30R                      │ │
│  │ 150 Bultos × $280.00 = $42,000.00   │ │
│  │ Especif: Bultos 50kg marca CEMEX    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Totales:                                  │
│  Subtotal:    $42,000.00                   │
│  IVA (16%):   $6,720.00                    │
│  ──────────────────────────────────        │
│  TOTAL:       $48,720.00                   │
│                                            │
│  Origen:                                   │
│  Basada en: REQ-228-001                    │
│                                            │
│  Estado: 🟡 Pendiente                      │
│                                            │
│  [Autorizar]  [Cancelar]  [Imprimir PDF]   │
│                                            │
└────────────────────────────────────────────┘
```

### 4. **Lista de Proveedores** (`/compras/proveedores`)

```
┌────────────────────────────────────────────┐
│  👥 Proveedores                            │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ CEMEX MÉXICO                         │ │
│  │ RFC: CEM920325XX1                    │ │
│  │ Contacto: Lic. Roberto Gómez         │ │
│  │ Tel: 8112345678                      │ │
│  │ Crédito: 30 días                     │ │
│  │ Estado: ✅ Activo                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Aceros del Norte                     │ │
│  │ RFC: ADN850612XX5                    │ │
│  │ Contacto: Ing. Pedro Sánchez         │ │
│  │ Tel: 8187654321                      │ │
│  │ Crédito: 15 días                     │ │
│  │ Estado: ✅ Activo                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Nuevo Proveedor]                       │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔗 RELACIONES CON OTROS MÓDULOS

### Dashboard → Compras
```
Dashboard CREA obra 228
    ↓
Compras VE obra 228 en selector
    ↓
✅ Puede crear OC para esa obra
```

### Requisiciones → Compras
```
Requisiciones CREA REQ-228-001
    ↓
Requisición estado: "Aprobada"
    ↓
Compras VE la requisición
    ↓
Compras CREA OC basada en requisición
    ↓
OC tiene campo: requisicion_origen_id
```

### Compras → Pagos
```
Compras CREA OC 228-A01GM-CEMEX por $48,720
    ↓
Estado: "Autorizada" → Se envió la orden
    ↓
Estado: "Recibida" → Material llegó a obra
    ↓
Proveedor EMITE factura
    ↓
Pagos REGISTRA factura vinculada a OC
    ↓
Pagos PROCESA pago de $48,720
```

### Compras → Dashboard (lectura)
```
Compras CREA 10 OC para obra 228
Total: $500,000
    ↓
Dashboard LEE todas las OC de obra 228
    ↓
Dashboard CALCULA:
    ├─ Gastado: $500,000
    ├─ % Ejercido: (500k / presupuesto) × 100
    └─ Muestra en dashboard individual
```

---

## 🎯 ESTADOS DEL MÓDULO

### Estado 1: EMPTY (Sin Proveedores)
```
┌────────────────────────────────────────────┐
│                                            │
│     👥 Proveedores                         │
│                                            │
│    No hay proveedores registrados          │
│                                            │
│    [+ Registrar Primer Proveedor]          │
│                                            │
└────────────────────────────────────────────┘
```

### Estado 2: EMPTY (Sin Órdenes)
```
┌────────────────────────────────────────────┐
│                                            │
│     🛒 Órdenes de Compra                   │
│                                            │
│    No hay órdenes de compra creadas        │
│                                            │
│    [+ Nueva Orden de Compra]               │
│                                            │
└────────────────────────────────────────────┘
```

### Estado 3: LOADING
```
┌────────────────────────────────────────────┐
│                                            │
│     🛒 Órdenes de Compra                   │
│                                            │
│    ⏳ Cargando órdenes...                  │
│                                            │
└────────────────────────────────────────────┘
```

---

## 📋 REGLAS DE NEGOCIO

### ✅ Al Crear Proveedor:
1. **RFC único** - No puede haber dos proveedores con el mismo RFC
2. **Datos obligatorios** - Razón social, RFC, contacto
3. **Días de crédito** - Mínimo 0, máximo 90 días

### ✅ Al Crear Orden de Compra:
1. **Obra obligatoria** - Debe seleccionar una obra activa
2. **Proveedor obligatorio** - Debe existir en catálogo
3. **Folio único** - Formato: `{codigo_obra}-A{secuencial:02d}GM-{nombre_proveedor}`
4. **Mínimo 1 item** - No se puede guardar sin items
5. **Cálculo automático de IVA** - 16% sobre subtotal
6. **Estado inicial** - Siempre "pendiente"

### ✅ Generación de Folio:
```typescript
// Algoritmo
const codigoObra = "228";
const secuencial = (ordenesObra.length + 1).toString().padStart(2, '0');
const nombreProveedor = "CEMEX";
const folio = `${codigoObra}-A${secuencial}GM-${nombreProveedor}`;

// Resultado: 228-A01GM-CEMEX, 228-A02GM-ACEROS, etc.
```

### ✅ Estados de la OC:
- **Pendiente** 🟡 - Recién creada, esperando autorización
- **Autorizada** 🟢 - Aprobada, enviada al proveedor
- **Recibida** 🔵 - Material recibido en obra
- **Cancelada** 🔴 - Orden cancelada (con motivo)

### ⚠️ Validaciones:
- No se puede editar una OC "Recibida"
- No se puede eliminar una OC con factura asociada
- No se puede autorizar sin items
- Precio unitario debe ser > 0

---

## 🔧 API QUE USA

```typescript
import { 
  obrasApi,              // Leer obras para selector
  proveedoresApi,        // CRUD de proveedores
  ordenesCompraApi,      // CRUD de órdenes
  requisicionesApi       // Leer requisiciones para convertir
} from '@/app/utils/api';
```

### Llamadas Típicas:

**Crear proveedor:**
```typescript
await proveedoresApi.create({
  razon_social: "CEMEX MÉXICO",
  rfc: "CEM920325XX1",
  nombre_comercial: "CEMEX",
  contacto: "Lic. Roberto Gómez",
  telefono: "8112345678",
  email: "ventas@cemex.com",
  dias_credito: 30
});
```

**Crear orden de compra:**
```typescript
await ordenesCompraApi.create({
  obra_id: "uuid-228",
  proveedor_id: "uuid-prov-123",
  fecha_entrega_estimada: "2025-02-12",
  requisicion_origen_id: "uuid-req-001",
  items: [
    {
      descripcion: "Cemento CPC 30R",
      unidad: "Bulto",
      cantidad: 150,
      precio_unitario: 280
    }
  ],
  subtotal: 42000,
  iva: 6720,
  monto_total: 48720,
  estado: "pendiente"
});
```

**Leer órdenes de una obra:**
```typescript
const response = await ordenesCompraApi.getByObra("uuid-228");
const ordenes = response.data;
```

---

## 📊 EJEMPLO COMPLETO

### Día 1: Comprador crea proveedor
```
Usuario: Juan Pérez (Comprador)

1. Abre /compras/proveedores
2. Clic "Nuevo Proveedor"
3. Llena formulario:
   - Razón Social: CEMEX MÉXICO
   - RFC: CEM920325XX1
   - Contacto: Lic. Roberto Gómez
   - Teléfono: 8112345678
   - Días Crédito: 30
4. Clic "Guardar"

Resultado:
✅ Proveedor CEMEX creado
✅ Disponible en selector de proveedores
```

### Día 2: Comprador crea OC desde requisición
```
Usuario: Juan Pérez (Comprador)

1. Ve REQ-228-001 estado "Aprobada"
2. Clic "Convertir a Orden de Compra"
3. Formulario pre-llenado:
   - Obra: 228 ✅
   - Items: Cemento 150 bultos ✅
4. Selecciona:
   - Proveedor: CEMEX
   - Precio unitario: $280
5. Sistema calcula:
   - Subtotal: $42,000
   - IVA: $6,720
   - Total: $48,720
6. Clic "Guardar"

Resultado:
✅ OC 228-A01GM-CEMEX creada
✅ Monto: $48,720
✅ Estado: Pendiente
✅ Requisición actualizada: "Atendida"
```

### Día 3: Se autoriza la orden
```
Usuario: Gerente aprueba

1. Abre OC 228-A01GM-CEMEX
2. Revisa items y montos
3. Clic "Autorizar"

Resultado:
✅ Estado: Autorizada
✅ Se envía al proveedor
✅ Material en camino
```

### Día 5: Material recibido
```
Usuario: Residente confirma recepción

1. Abre OC 228-A01GM-CEMEX
2. Verifica material en obra
3. Clic "Marcar como Recibida"

Resultado:
✅ Estado: Recibida
✅ Material en inventario
✅ Esperando factura del proveedor
```

---

## 🎯 PUNTO CLAVE

**LA ORDEN DE COMPRA ES EL COMPROMISO DE PAGO:**

```
REQUISICIÓN (solicitud)
    ↓
ORDEN DE COMPRA (compromiso)  ← ESTAMOS AQUÍ
    ↓
FACTURA (documento fiscal)
    ↓
PAGO (salida de dinero)
```

Crear una OC significa:
- ✅ Se va a gastar dinero
- ✅ Se compromete presupuesto
- ⚠️ PERO AÚN NO SE PAGA

---

**Documento creado:** 2025-02-09  
**Módulo:** Compras  
**Rol:** Comprador - Gestiona proveedores y órdenes de compra
