# 💳 MÓDULO PAGOS - Gestión de Pagos y Facturas

## 🎯 PROPÓSITO

El módulo de Pagos es donde:
- Los **contadores** registran facturas recibidas
- Se programa la **salida real de dinero**
- Se procesan pagos a proveedores
- Se lleva control de cuentas por pagar y pagadas

**Usuarios:** Contador, Administrador

---

## 📥 INFORMACIÓN QUE NECESITA (INPUTS)

### 1. **Orden de Compra Recibida (Pre-requisito)**
```typescript
// Debe existir una OC en estado "Recibida"
{
  orden_id: "uuid-oc-123",
  folio: "228-A01GM-CEMEX",
  obra_id: "uuid-228",
  proveedor_id: "uuid-prov-123",
  monto_total: 48720,
  estado: "recibida"  // ← Material ya llegó a obra
}
```

### 2. **Factura del Proveedor**
```typescript
{
  // OBLIGATORIO
  obra_id: "uuid-228",                   // A qué obra pertenece
  orden_compra_id: "uuid-oc-123",        // De qué OC viene
  proveedor_id: "uuid-prov-123",         // Quién emitió
  
  // Datos fiscales
  folio_fiscal: "FAC-CEMEX-12345",       // UUID/Folio de CFDI
  serie: "A",
  numero_factura: "12345",
  
  // Fechas
  fecha_emision: "2025-02-12",           // Cuándo se emitió
  fecha_vencimiento: "2025-03-14",       // Cuándo vence (30 días)
  
  // Montos
  subtotal: 42000,
  iva: 6720,
  monto_total: 48720,
  
  // Archivos
  archivo_xml: "ruta/factura.xml",       // CFDI XML
  archivo_pdf: "ruta/factura.pdf",       // PDF de la factura
  
  // Estado
  estado: "por_pagar"  // por_pagar | programada | pagada | vencida
}
```

### 3. **Pago a Realizar**
```typescript
{
  // OBLIGATORIO
  obra_id: "uuid-228",
  factura_id: "uuid-fac-456",
  proveedor_id: "uuid-prov-123",
  
  // Datos del pago
  folio_pago: "PAG-228-001",             // Generado automático
  monto: 48720,
  fecha_programada: "2025-03-14",        // Cuándo se va a pagar
  fecha_pago_real: "2025-03-14",         // Cuándo SE PAGÓ (al procesar)
  
  // Método de pago
  metodo_pago: "transferencia",          // transferencia | cheque | efectivo
  referencia: "TRANSF-12345",            // Número de referencia bancaria
  banco: "BBVA",
  cuenta: "****1234",
  
  // Estado
  estado: "programado"  // programado | procesado | cancelado
}
```

---

## 📤 INFORMACIÓN QUE CREA (OUTPUTS)

### 1. **FACTURA**

```typescript
// Se guarda en KV Store
Clave: "factura:uuid-fac-456"

Valor: {
  factura_id: "uuid-fac-456",
  obra_id: "uuid-228",               // ← Relacionada con obra
  orden_compra_id: "uuid-oc-123",    // ← Relacionada con OC
  proveedor_id: "uuid-prov-123",     // ← Relacionada con proveedor
  folio_fiscal: "FAC-CEMEX-12345",
  fecha_emision: "2025-02-12",
  fecha_vencimiento: "2025-03-14",
  monto_total: 48720,
  estado: "por_pagar",
  created_at: "2025-02-12T14:00:00Z",
  updated_at: "2025-02-12T14:00:00Z"
}
```

### 2. **PAGO (Salida Real de Dinero)**

```typescript
// Se guarda en KV Store
Clave: "pago:uuid-pag-789"

Valor: {
  pago_id: "uuid-pag-789",
  obra_id: "uuid-228",               // ← Relacionada con obra
  factura_id: "uuid-fac-456",        // ← Relacionada con factura
  proveedor_id: "uuid-prov-123",     // ← Relacionada con proveedor
  folio_pago: "PAG-228-001",
  monto: 48720,
  fecha_programada: "2025-03-14",
  fecha_pago_real: "2025-03-14",     // Cuando SE PROCESÓ
  metodo_pago: "transferencia",
  referencia: "TRANSF-12345",
  estado: "procesado",
  created_at: "2025-03-14T10:00:00Z",
  updated_at: "2025-03-14T10:00:00Z"
}
```

### 3. **¿Qué Habilita Esto?**

✅ **Para el Dashboard:**
- Dashboard ve: "Pagado en obra 228: $48,720"
- Métricas actualizadas:
  - Gastado: $48,720 (de la OC)
  - Pagado: $48,720 (de este pago)
  - Por Pagar: $0

✅ **Para Compras:**
- OC 228-A01GM-CEMEX muestra: "✅ Pagada"
- Ciclo completo cerrado

✅ **Para Finanzas:**
- Flujo de caja actualizado
- Saldo con proveedor CEMEX: $0
- Historial de pagos documentado

---

## 🔄 FLUJO OPERATIVO

### PASO 1: Registrar Factura Recibida

```
Proveedor envía factura por correo
    ↓
Usuario Contador descarga XML y PDF
    ↓
[Módulo Pagos] → Tab "Facturas"
    ↓
[Clic] "Registrar Nueva Factura"
    ↓
[Formulario]
    ├─ Selector de Obra
    ├─ Selector de Orden de Compra (filtra por obra)
    ├─ Proveedor (auto-llenado de la OC)
    ├─ Folio Fiscal (UUID del XML)
    ├─ Fecha Emisión
    ├─ Fecha Vencimiento (auto: fecha + días crédito)
    ├─ Monto (auto: de la OC, pero puede editar)
    └─ Archivos: [Subir XML] [Subir PDF]
    ↓
[Validar]
    ├─ Monto de factura ≈ Monto de OC
    ├─ Proveedor correcto
    └─ Folio fiscal único
    ↓
[Guardar]
    ├─ POST /api/facturas → Guarda factura
    └─ Estado: "por_pagar"
    ↓
[Success] → Factura registrada, aparece en lista
```

### PASO 2: Programación Semanal de Pagos

```
Usuario abre "Programación Semanal"
    ↓
[Calendario] → Selecciona semana (ej: Semana 7, 2025)
    ↓
[Sistema carga]
    ├─ Facturas que vencen esta semana
    ├─ Pagos ya programados
    └─ Pagos procesados
    ↓
[Vista de tabla]
    ┌────────────────────────────────────┐
    │ Lun | Mar | Mié | Jue | Vie       │
    ├────────────────────────────────────┤
    │  12 |  13 |  14 |  15 |  16       │
    │     |     | 🔴2 | 🟢1 |           │
    │     |     | FAC | PAG |           │
    └────────────────────────────────────┘
    
    🔴 Facturas por vencer
    🟢 Pagos programados
    ✅ Pagos procesados
    ↓
[Clic en día] → Ver facturas de ese día
```

### PASO 3: Programar Pago

```
Usuario ve factura FAC-CEMEX-12345
    ↓
Estado: "Por Pagar"
Vencimiento: 14-Mar-2025
Monto: $48,720
    ↓
[Clic] "Programar Pago"
    ↓
[Formulario]
    ├─ Fecha Programada: [14-Mar-2025 📅]
    ├─ Método: [Transferencia ▼]
    ├─ Banco: [BBVA]
    └─ Cuenta: [****1234]
    ↓
[Guardar]
    ├─ POST /api/pagos → Crea pago programado
    ├─ Estado del pago: "programado"
    └─ Estado de factura: "programada"
    ↓
[Success] → Pago aparece en calendario
```

### PASO 4: Procesar Pago

```
Día del pago (14-Mar-2025)
    ↓
Usuario Contador hace transferencia en banco
    ↓
[Obtiene] Referencia bancaria: "TRANSF-12345"
    ↓
[Módulo Pagos] → Tab "Procesar Pagos"
    ↓
[Ve lista] de pagos programados para hoy
    ↓
[Selecciona] PAG-228-001 ($48,720 a CEMEX)
    ↓
[Clic] "Marcar como Procesado"
    ↓
[Formulario]
    ├─ Fecha Real de Pago: [14-Mar-2025]  (hoy)
    ├─ Referencia: [TRANSF-12345______]
    └─ Confirmación
    ↓
[Guardar]
    ├─ PUT /api/pagos/:id/procesar
    ├─ Estado del pago: "procesado"
    ├─ Estado de factura: "pagada"
    └─ fecha_pago_real = hoy
    ↓
[Success] → Pago procesado
    ├─ ✅ Dinero salió de la cuenta
    ├─ ✅ Factura marcada como pagada
    └─ ✅ Dashboard actualizado
```

---

## 📊 PANTALLAS DEL MÓDULO

### 1. **Programación Semanal** (`/pagos/programacion`)

```
┌────────────────────────────────────────────┐
│  💳 Programación de Pagos - Semana 7/2025  │
├────────────────────────────────────────────┤
│                                            │
│  [◀ Semana Anterior]  [Semana Siguiente ▶] │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ LUN 10 │ MAR 11 │ MIÉ 12 │ JUE 13 │ │ │
│  ├────────┼────────┼────────┼────────┼──│ │
│  │        │        │        │ 🟢 2   │  │ │
│  │        │        │        │ Pagos  │  │ │
│  │        │        │        │$94,440 │  │ │
│  └────────┴────────┴────────┴────────┴──┘ │
│                                            │
│  │ VIE 14 │ SÁB 15 │ DOM 16 │            │ │
│  ├────────┼────────┼────────┤            │ │
│  │ 🔴 3   │        │        │            │ │
│  │ Vencen │        │        │            │ │
│  │$150,000│        │        │            │ │
│  └────────┴────────┴────────┘            │ │
│                                            │
│  Resumen de la Semana:                     │
│  • Pagos Programados: 2 ($94,440)          │
│  • Facturas por Vencer: 3 ($150,000)       │
│  • Pagos Procesados: 1 ($48,720)           │
│                                            │
└────────────────────────────────────────────┘
```

### 2. **Lista de Facturas** (`/pagos/facturas`)

```
┌────────────────────────────────────────────┐
│  📄 Gestión de Facturas                    │
├────────────────────────────────────────────┤
│                                            │
│  Estado: [Por Pagar ▼]                     │
│  Obra: [CASTELLO F/G/H ▼]                  │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ FAC-CEMEX-12345                      │ │
│  │ Proveedor: CEMEX MÉXICO              │ │
│  │ OC: 228-A01GM-CEMEX                  │ │
│  │ Obra: CASTELLO F/G/H (228)           │ │
│  │ Monto: $48,720.00                    │ │
│  │ Emisión: 12-Feb-2025                 │ │
│  │ Vencimiento: 14-Mar-2025 (en 2 días) │ │
│  │ Estado: 🟡 Por Pagar                 │ │
│  │ [Programar Pago] [Ver XML] [Ver PDF] │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ FAC-ACEROS-98765                     │ │
│  │ Proveedor: Aceros del Norte          │ │
│  │ OC: 228-A02GM-ACEROS                 │ │
│  │ Obra: CASTELLO F/G/H (228)           │ │
│  │ Monto: $125,600.00                   │ │
│  │ Emisión: 10-Feb-2025                 │ │
│  │ Vencimiento: 12-Feb-2025 (🔴VENCIDA) │ │
│  │ Estado: 🔴 Vencida                   │ │
│  │ [PAGAR URGENTE] [Ver XML] [Ver PDF]  │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Registrar Nueva Factura]               │
│                                            │
└────────────────────────────────────────────┘
```

### 3. **Procesar Pagos** (`/pagos/procesar`)

```
┌────────────────────────────────────────────┐
│  ✅ Procesar Pagos Programados             │
├────────────────────────────────────────────┤
│                                            │
│  Fecha: [14-Mar-2025 📅]                   │
│                                            │
│  Pagos Programados para Hoy:               │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ ☑️ PAG-228-001                        │ │
│  │ Proveedor: CEMEX MÉXICO              │ │
│  │ Factura: FAC-CEMEX-12345             │ │
│  │ Obra: CASTELLO F/G/H (228)           │ │
│  │ Monto: $48,720.00                    │ │
│  │ Método: Transferencia                │ │
│  │ Banco: BBVA ****1234                 │ │
│  │                                      │ │
│  │ Referencia: [TRANSF-12345________]   │ │
│  │                                      │ │
│  │ [Marcar como Procesado]              │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ ☑️ PAG-228-002                        │ │
│  │ Proveedor: Aceros del Norte          │ │
│  │ Factura: FAC-ACEROS-98765            │ │
│  │ Obra: CASTELLO F/G/H (228)           │ │
│  │ Monto: $125,600.00                   │ │
│  │ Método: Transferencia                │ │
│  │ Banco: Santander ****5678            │ │
│  │                                      │ │
│  │ Referencia: [_____________________]  │ │
│  │                                      │ │
│  │ [Marcar como Procesado]              │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Total a Procesar Hoy: $174,320.00         │
│                                            │
└────────────────────────────────────────────┘
```

### 4. **Historial de Pagos** (`/pagos/historial`)

```
┌────────────────────────────────────────────┐
│  📚 Historial de Pagos                     │
├────────────────────────────────────────────┤
│                                            │
│  Período: [Febrero 2025 ▼]                 │
│  Obra: [Todas ▼]                           │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ ✅ PAG-228-001                        │ │
│  │ Fecha: 14-Mar-2025                   │ │
│  │ Proveedor: CEMEX MÉXICO              │ │
│  │ Obra: CASTELLO F/G/H (228)           │ │
│  │ Monto: $48,720.00                    │ │
│  │ Método: Transferencia                │ │
│  │ Referencia: TRANSF-12345             │ │
│  │ [Ver Comprobante]                    │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Total Pagado en Febrero: $2,500,000.00    │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔗 RELACIONES CON OTROS MÓDULOS

### Compras → Pagos
```
Compras CREA OC 228-A01GM-CEMEX
Estado: "Recibida" (material llegó)
    ↓
Proveedor EMITE factura
    ↓
Pagos REGISTRA factura vinculada a OC
    ↓
factura.orden_compra_id = "uuid-oc-123"
```

### Pagos → Dashboard (lectura)
```
Pagos PROCESA pago de $48,720
    ↓
Dashboard LEE todos los pagos de obra 228
    ↓
Dashboard CALCULA:
    ├─ Gastado: $48,720 (de OC)
    ├─ Pagado: $48,720 (de este pago)
    └─ Por Pagar: $0
```

---

## 📋 REGLAS DE NEGOCIO

### ✅ Al Registrar Factura:
1. **OC obligatoria** - Debe venir de una orden de compra
2. **Monto validado** - Debe ser ≈ monto de la OC (±5% tolerancia)
3. **Folio fiscal único** - No duplicados (UUID del SAT)
4. **Fecha vencimiento** - Auto-calculada: fecha_emision + dias_credito_proveedor
5. **Estado inicial** - Siempre "por_pagar"

### ✅ Al Programar Pago:
1. **Factura registrada** - Debe existir la factura
2. **Fecha programada** - Normalmente = fecha vencimiento
3. **Método de pago** - Transferencia | Cheque | Efectivo
4. **Estado** - "programado" (no se ha pagado aún)

### ✅ Al Procesar Pago:
1. **Referencia obligatoria** - Número de transferencia/cheque
2. **Fecha real** - Cuándo se ejecutó el pago
3. **Irreversible** - No se puede "despagar" (solo cancelar con nota)
4. **Actualiza estados**:
   - Pago: "procesado"
   - Factura: "pagada"
   - OC: "pagada" (si era la última factura pendiente)

### ⚠️ Alertas:
- Factura próxima a vencer (3 días) → 🟡 Amarillo
- Factura vencida → 🔴 Rojo
- Pago programado no procesado → 🟡 Alerta

---

## 🔧 API QUE USA

```typescript
import { 
  obrasApi,              // Leer obras
  ordenesCompraApi,      // Leer OC para vincular factura
  proveedoresApi,        // Info de proveedores
  facturasApi,           // CRUD de facturas
  pagosApi              // CRUD de pagos
} from '@/app/utils/api';
```

---

## 📊 EJEMPLO COMPLETO

### Día 12-Feb: Llega factura
```
Usuario: Laura Martínez (Contador)

1. Recibe email de CEMEX con factura
2. Descarga FAC-CEMEX-12345.xml y .pdf
3. Abre /pagos/facturas
4. Clic "Registrar Nueva Factura"
5. Llena:
   - Obra: CASTELLO F/G/H (228)
   - OC: 228-A01GM-CEMEX (filtra por obra)
   - Folio Fiscal: UUID del XML
   - Monto: $48,720
   - Vence: 14-Mar-2025 (30 días)
6. Sube archivos XML y PDF
7. Clic "Guardar"

Resultado:
✅ Factura registrada
✅ Estado: Por Pagar
✅ Aparece en lista con fecha vencimiento
```

### Día 10-Mar: Programa pago
```
Usuario: Laura Martínez

1. Abre /pagos/facturas
2. Ve FAC-CEMEX-12345 vence en 4 días
3. Clic "Programar Pago"
4. Fecha: 14-Mar-2025
5. Método: Transferencia BBVA
6. Clic "Guardar"

Resultado:
✅ Pago PAG-228-001 programado
✅ Aparece en calendario día 14
✅ Factura estado: Programada
```

### Día 14-Mar: Procesa pago
```
Usuario: Laura Martínez

1. Abre banco y hace transferencia
2. Obtiene referencia: TRANSF-12345
3. Abre /pagos/procesar
4. Ve PAG-228-001
5. Ingresa referencia: TRANSF-12345
6. Clic "Marcar como Procesado"

Resultado:
✅ Pago procesado
✅ Dinero salió de cuenta
✅ Factura: Pagada
✅ OC: Pagada
✅ Dashboard actualizado:
   - Pagado: $48,720 ✅
   - Por Pagar: $0
```

---

**Documento creado:** 2025-02-09  
**Módulo:** Pagos  
**Rol:** Contador - Registra facturas y procesa pagos
