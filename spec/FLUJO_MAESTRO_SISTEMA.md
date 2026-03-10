# 🏗️ FLUJO MAESTRO DEL SISTEMA ERP - CONSTRUCTORA IDP

## 🎯 OBJETIVO DEL DOCUMENTO

Este documento muestra **el flujo completo del sistema desde cero**, explicando cómo cada módulo trabaja en conjunto desde que se crea una obra hasta que se completa todo el ciclo operativo y financiero.

---

## 📅 DÍA 0: SISTEMA VACÍO

### Estado Inicial
```
┌────────────────────────────────────────────┐
│                                            │
│     🏗️ ERP Constructora IDP               │
│                                            │
│            SISTEMA VACÍO                   │
│                                            │
│     ❌ 0 Obras                             │
│     ❌ 0 Proveedores                       │
│     ❌ 0 Destajistas                       │
│     ❌ 0 Requisiciones                     │
│     ❌ 0 Órdenes de Compra                 │
│     ❌ 0 Pagos                             │
│                                            │
│     Base de Datos: KV Store vacío          │
│                                            │
└────────────────────────────────────────────┘
```

**Módulos disponibles pero sin datos:**
- ✅ Dashboard (sin obras)
- ✅ Requisiciones (sin obras, no puede usarse)
- ✅ Compras (sin obras, no puede usarse)
- ✅ Pagos (sin obras, no puede usarse)
- ✅ Destajos (sin obras, no puede usarse)

---

## 📅 DÍA 1: GERENTE CREA LA PRIMERA OBRA

### 🎯 MÓDULO: DASHBOARD

**Usuario:** Gerente General  
**Acción:** Crear obra nueva

```
Gerente abre Dashboard
    ↓
[Estado: EMPTY]
"No hay obras registradas"
    ↓
[Clic] "Crear Primera Obra"
    ↓
[Formulario]
    ├─ Código: 228
    ├─ Nombre: CASTELLO TORRE F/G/H
    ├─ Cliente: CASTELLO INMOBILIARIO
    ├─ Residente: Ing. Carlos Méndez
    ├─ Presupuesto: $15,000,000.00
    ├─ Fecha Inicio: 15-Ene-2025
    └─ Fecha Fin: 31-Dic-2026
    ↓
[Guardar] → POST /api/obras
    ↓
[KV Store] Guarda:
Clave: "obra:uuid-228"
Valor: {
  obra_id: "uuid-228",
  codigo_obra: "228",
  nombre_obra: "CASTELLO TORRE F/G/H",
  cliente: "CASTELLO INMOBILIARIO",
  presupuesto_total: 15000000,
  estado: "activa",
  created_at: "2025-01-15T09:00:00Z"
}
```

### ✅ RESULTADO DÍA 1:

```
KV Store ahora tiene:
└─ obra:uuid-228 ✅

Dashboard muestra:
└─ 1 Obra Activa
   └─ CASTELLO F/G/H (228)
      ├─ Presupuesto: $15,000,000
      ├─ Gastado: $0
      └─ % Ejercido: 0%

TODOS los módulos ahora ven:
├─ Requisiciones: [Obra 228 en selector] ✅
├─ Compras: [Obra 228 en selector] ✅
├─ Pagos: [Obra 228 en selector] ✅
└─ Destajos: [Obra 228 en selector] ✅
```

**🎯 PUNTO CRÍTICO:**  
**LA OBRA ES LA LLAVE QUE ABRE TODO EL SISTEMA**

---

## 📅 DÍA 2: RESIDENTE SOLICITA MATERIAL (Primera Requisición)

### 🎯 MÓDULO: REQUISICIONES

**Usuario:** Ing. Carlos Méndez (Residente)  
**Acción:** Crear requisición de material

```
Residente abre Requisiciones
    ↓
[Estado: EMPTY] pero VE obra 228 disponible ✅
    ↓
[Clic] "Nueva Requisición"
    ↓
[Formulario]
    ├─ Obra: [CASTELLO F/G/H (228)] ← Selector activo
    ├─ Solicitante: Ing. Carlos Méndez
    ├─ Fecha Requerida: 20-Ene-2025
    ├─ Motivo: "Material para losa N1"
    └─ Items:
        1. Cemento CPC 30R - 150 Bultos
        2. Acero corrugado 3/8 - 200 Varillas
    ↓
[Guardar] → POST /api/requisiciones
    ↓
[KV Store] Guarda:
Clave: "requisicion:uuid-req-001"
Valor: {
  requisicion_id: "uuid-req-001",
  obra_id: "uuid-228", ← RELACIONADA CON OBRA
  folio: "REQ-228-001",
  solicitante: "Ing. Carlos Méndez",
  fecha_requerida: "2025-01-20",
  estado: "pendiente"
}

Clave: "item_requisicion:uuid-item-1"
Valor: {
  requisicion_id: "uuid-req-001",
  descripcion: "Cemento CPC 30R",
  cantidad_solicitada: 150,
  unidad: "Bulto"
}

Clave: "item_requisicion:uuid-item-2"
Valor: {
  requisicion_id: "uuid-req-001",
  descripcion: "Acero corrugado 3/8",
  cantidad_solicitada: 200,
  unidad: "Varilla"
}
```

### ✅ RESULTADO DÍA 2:

```
KV Store ahora tiene:
├─ obra:uuid-228
├─ requisicion:uuid-req-001 ✅ (NEW)
├─ item_requisicion:uuid-item-1 ✅ (NEW)
└─ item_requisicion:uuid-item-2 ✅ (NEW)

Requisiciones muestra:
└─ REQ-228-001
   ├─ Obra: 228
   ├─ Estado: Pendiente 🟡
   └─ 2 items solicitados

Compras puede ver:
└─ REQ-228-001 (lista para convertir a OC)

Dashboard actualizado:
└─ Obra 228:
   ├─ Requisiciones: 1
   └─ Estado: Material solicitado
```

---

## 📅 DÍA 3: COMPRADOR CREA PROVEEDOR Y ORDEN DE COMPRA

### 🎯 MÓDULO: COMPRAS - Paso 1: Registrar Proveedor

**Usuario:** Juan Pérez (Comprador)  
**Acción:** Registrar proveedor CEMEX

```
Comprador abre Compras → Proveedores
    ↓
[Estado: EMPTY]
    ↓
[Clic] "Nuevo Proveedor"
    ↓
[Formulario]
    ├─ Razón Social: CEMEX MÉXICO
    ├─ RFC: CEM920325XX1
    ├─ Contacto: Lic. Roberto Gómez
    ├─ Teléfono: 8112345678
    ├─ Email: ventas@cemex.com
    └─ Días Crédito: 30
    ↓
[Guardar] → POST /api/proveedores
    ↓
[KV Store] Guarda:
Clave: "proveedor:uuid-prov-123"
Valor: {
  proveedor_id: "uuid-prov-123",
  razon_social: "CEMEX MÉXICO",
  rfc: "CEM920325XX1",
  dias_credito: 30,
  activo: true
}
```

### 🎯 MÓDULO: COMPRAS - Paso 2: Crear Orden de Compra

```
Comprador ve REQ-228-001
    ↓
[Clic] "Convertir a Orden de Compra"
    ↓
[Formulario Pre-llenado]
    ├─ Obra: 228 (de la requisición) ✅
    ├─ Items: Cemento 150 bultos (de la requisición) ✅
    ├─ Proveedor: [CEMEX MÉXICO ▼] ← Elige
    ├─ Precio Unitario Cemento: $280
    ├─ Subtotal: $42,000
    ├─ IVA (16%): $6,720
    └─ Total: $48,720
    ↓
[Guardar] → POST /api/ordenes-compra
    ↓
[KV Store] Guarda:
Clave: "orden_compra:uuid-oc-123"
Valor: {
  orden_id: "uuid-oc-123",
  obra_id: "uuid-228", ← RELACIONADA CON OBRA
  proveedor_id: "uuid-prov-123", ← RELACIONADA CON PROVEEDOR
  requisicion_origen_id: "uuid-req-001", ← RELACIONADA CON REQUISICIÓN
  folio: "228-A01GM-CEMEX",
  monto_total: 48720,
  estado: "pendiente"
}
```

### ✅ RESULTADO DÍA 3:

```
KV Store ahora tiene:
├─ obra:uuid-228
├─ requisicion:uuid-req-001
├─ proveedor:uuid-prov-123 ✅ (NEW)
└─ orden_compra:uuid-oc-123 ✅ (NEW)

Compras muestra:
└─ OC 228-A01GM-CEMEX
   ├─ Obra: 228
   ├─ Proveedor: CEMEX
   ├─ Monto: $48,720
   └─ Estado: Pendiente 🟡

Requisiciones actualizada:
└─ REQ-228-001
   └─ Estado: Atendida (OC 228-A01GM-CEMEX) ✅

Dashboard actualizado:
└─ Obra 228:
   ├─ Presupuesto: $15,000,000
   ├─ Gastado: $48,720 ⬆️ (de la OC)
   ├─ % Ejercido: 0.32%
   └─ Por Pagar: $48,720 (aún no se paga)
```

**🎯 PUNTO CRÍTICO:**  
**CREAR OC = COMPROMISO DE PAGO (pero aún no se paga)**

---

## 📅 DÍA 5: ORDEN AUTORIZADA Y MATERIAL RECIBIDO

### 🎯 MÓDULO: COMPRAS

```
Gerente aprueba OC
    ↓
PUT /api/ordenes-compra/uuid-oc-123/status
estado = "autorizada"
    ↓
Material llega a obra
    ↓
Residente confirma recepción
    ↓
PUT /api/ordenes-compra/uuid-oc-123/status
estado = "recibida"
```

### ✅ RESULTADO DÍA 5:

```
orden_compra:uuid-oc-123
└─ estado: "recibida" ✅

Dashboard:
└─ Obra 228:
   └─ Material recibido, esperando factura
```

---

## 📅 DÍA 7: PROVEEDOR ENVÍA FACTURA

### 🎯 MÓDULO: PAGOS - Registrar Factura

**Usuario:** Laura Martínez (Contador)  
**Acción:** Registrar factura recibida

```
Proveedor CEMEX envía factura por email
    ↓
Contador descarga XML y PDF
    ↓
[Módulo Pagos] → Facturas
    ↓
[Clic] "Registrar Nueva Factura"
    ↓
[Formulario]
    ├─ Obra: 228
    ├─ Orden de Compra: [228-A01GM-CEMEX ▼]
    ├─ Proveedor: CEMEX (auto-llenado de OC)
    ├─ Folio Fiscal: FAC-CEMEX-12345
    ├─ Fecha Emisión: 07-Feb-2025
    ├─ Fecha Vencimiento: 08-Mar-2025 (30 días)
    ├─ Monto: $48,720 (de la OC)
    └─ Archivos: [XML] [PDF]
    ↓
[Guardar] → POST /api/facturas
    ↓
[KV Store] Guarda:
Clave: "factura:uuid-fac-456"
Valor: {
  factura_id: "uuid-fac-456",
  obra_id: "uuid-228", ← RELACIONADA CON OBRA
  orden_compra_id: "uuid-oc-123", ← RELACIONADA CON OC
  proveedor_id: "uuid-prov-123",
  folio_fiscal: "FAC-CEMEX-12345",
  fecha_vencimiento: "2025-03-08",
  monto_total: 48720,
  estado: "por_pagar"
}
```

### ✅ RESULTADO DÍA 7:

```
KV Store ahora tiene:
└─ factura:uuid-fac-456 ✅ (NEW)

Pagos muestra:
└─ FAC-CEMEX-12345
   ├─ Vence: 08-Mar-2025
   ├─ Monto: $48,720
   └─ Estado: Por Pagar 🟡

Dashboard:
└─ Obra 228:
   ├─ Gastado: $48,720
   ├─ Pagado: $0
   └─ Por Pagar: $48,720 ⬆️
```

---

## 📅 DÍA 30: PROGRAMAR Y PROCESAR PAGO

### 🎯 MÓDULO: PAGOS - Paso 1: Programar Pago

**Usuario:** Laura Martínez (Contador)

```
Contador ve factura próxima a vencer
    ↓
[Clic] "Programar Pago"
    ↓
[Formulario]
    ├─ Fecha: 08-Mar-2025 (vencimiento)
    ├─ Método: Transferencia
    ├─ Banco: BBVA
    └─ Cuenta: ****1234
    ↓
[Guardar] → POST /api/pagos
    ↓
[KV Store] Guarda:
Clave: "pago:uuid-pag-789"
Valor: {
  pago_id: "uuid-pag-789",
  obra_id: "uuid-228", ← RELACIONADA CON OBRA
  factura_id: "uuid-fac-456",
  proveedor_id: "uuid-prov-123",
  folio_pago: "PAG-228-001",
  monto: 48720,
  fecha_programada: "2025-03-08",
  metodo_pago: "transferencia",
  estado: "programado"
}
```

### 🎯 MÓDULO: PAGOS - Paso 2: Procesar Pago (Día del Vencimiento)

```
08-Mar-2025
    ↓
Contador hace transferencia en banco
    ↓
Obtiene referencia: TRANSF-12345
    ↓
[Módulo Pagos] → Procesar Pagos
    ↓
[Selecciona] PAG-228-001
    ↓
[Ingresa referencia] TRANSF-12345
    ↓
[Clic] "Marcar como Procesado"
    ↓
PUT /api/pagos/uuid-pag-789/procesar
    ↓
[Actualiza]
pago:uuid-pag-789
├─ estado: "procesado"
├─ fecha_pago_real: "2025-03-08"
└─ referencia: "TRANSF-12345"

factura:uuid-fac-456
└─ estado: "pagada"
```

### ✅ RESULTADO DÍA 30:

```
KV Store actualizado:
├─ pago:uuid-pag-789
│  └─ estado: "procesado" ✅
└─ factura:uuid-fac-456
   └─ estado: "pagada" ✅

Dashboard actualizado:
└─ Obra 228:
   ├─ Presupuesto: $15,000,000
   ├─ Gastado: $48,720
   ├─ Pagado: $48,720 ⬆️ (dinero SALIÓ)
   └─ Por Pagar: $0 ✅

Pagos muestra:
└─ Historial:
   └─ ✅ PAG-228-001
      ├─ CEMEX
      ├─ $48,720
      └─ Ref: TRANSF-12345

Compras muestra:
└─ OC 228-A01GM-CEMEX
   └─ Estado: ✅ Pagada
```

**🎯 CICLO MATERIAL COMPLETO:**
```
REQUISICIÓN → ORDEN COMPRA → FACTURA → PAGO ✅
```

---

## 📅 DÍA 10-14: CAPTURA DE DESTAJOS (Mano de Obra)

### 🎯 MÓDULO: DESTAJOS - Paso 1: Registrar Destajistas

**Usuario:** Ing. Carlos Méndez (Residente)

```
Residente abre Destajos → Catálogo
    ↓
[Clic] "Nuevo Destajista"
    ↓
[Formulario]
    ├─ Código: AG
    ├─ Nombre: Abraham García
    ├─ Especialidad: Albañilería
    ├─ Teléfono: 8123456789
    └─ Color: 🟥 Rojo
    ↓
POST /api/destajistas
    ↓
[KV Store] Guarda:
Clave: "destajista:uuid-dest-1"
Valor: {
  destajista_id: "uuid-dest-1",
  codigo: "AG",
  nombre_completo: "Abraham García",
  color_asignado: "#FF6B6B"
}
```

### 🎯 MÓDULO: DESTAJOS - Paso 2: Captura Semanal

```
Residente abre Captura Semanal
    ↓
Selecciona:
├─ Obra: 228
└─ Semana: 6 / 2025
    ↓
Tabla tipo Excel se abre vacía
    ↓
[Clic celda] Abraham García × Lunes
    ↓
[Modal]
    ├─ Concepto: Losa armada N1
    ├─ Cantidad: 50 M²
    ├─ Precio: $500/M²
    └─ Total: $25,000
    ↓
POST /api/avances
    ↓
[KV Store] Guarda:
Clave: "avance:uuid-av-001"
Valor: {
  avance_id: "uuid-av-001",
  obra_id: "uuid-228", ← RELACIONADA CON OBRA
  destajista_id: "uuid-dest-1",
  semana: 6,
  año: 2025,
  concepto: "Losa armada N1",
  cantidad: 50,
  monto_total: 25000,
  estado: "capturado"
}
    ↓
[Celda se pinta roja (color de AG)]
```

### ✅ RESULTADO SEMANA 6:

```
KV Store ahora tiene:
├─ destajista:uuid-dest-1 ✅ (NEW)
└─ avance:uuid-av-001 ✅ (NEW)

Destajos muestra:
└─ Semana 6/2025:
   └─ Abraham García
      ├─ Lunes: Losa N1 - $25,000
      └─ Total: $25,000

Dashboard actualizado:
└─ Obra 228:
   ├─ Mano de obra semana: $25,000
   └─ Destajistas activos: 1
```

---

## 📅 DÍA 15: RESIDENTE REVISA Y APRUEBA DESTAJOS

### 🎯 MÓDULO: DESTAJOS

```
Residente revisa avances de semana 6
    ↓
Valida:
├─ ¿Trabajo hecho? ✅
├─ ¿Cantidad correcta? ✅
└─ ¿Precio acordado? ✅
    ↓
[Clic] "Marcar como Revisado"
    ↓
PUT /api/avances/uuid-av-001
estado = "revisado"
```

### ✅ RESULTADO:

```
avance:uuid-av-001
└─ estado: "revisado" ✅

Pagos puede ver:
└─ Avances revisados listos para pago:
   └─ Abraham García: $25,000
```

---

## 📅 DÍA 17: CONTADOR PAGA A DESTAJISTA

### 🎯 MÓDULO: PAGOS

```
Contador programa pago de destajo
    ↓
POST /api/pagos
    ├─ tipo: "destajo" (no factura)
    ├─ avance_id: "uuid-av-001"
    ├─ monto: 25000
    └─ fecha: Viernes 21-Feb
    ↓
Viernes se procesa pago
    ↓
PUT /api/pagos/:id/procesar
```

### ✅ RESULTADO:

```
Dashboard actualizado:
└─ Obra 228:
   ├─ Gastado Material: $48,720
   ├─ Gastado Mano Obra: $25,000
   ├─ Total Gastado: $73,720
   └─ % Ejercido: 0.49%
```

**🎯 CICLO MANO DE OBRA COMPLETO:**
```
DESTAJISTA → AVANCE CAPTURADO → REVISIÓN → PAGO ✅
```

---

## 📊 ESTADO FINAL DEL SISTEMA (Después de 1 Mes)

### KV Store Completo:

```
KV Store (Base de Datos)
├─ obra:uuid-228 ✅
│
├─ requisicion:uuid-req-001 ✅
├─ requisicion:uuid-req-002 ✅
├─ requisicion:uuid-req-003 ✅
│
├─ proveedor:uuid-prov-123 (CEMEX) ✅
├─ proveedor:uuid-prov-124 (Aceros) ✅
│
├─ orden_compra:uuid-oc-123 ✅
├─ orden_compra:uuid-oc-124 ✅
│
├─ factura:uuid-fac-456 ✅
├─ factura:uuid-fac-457 ✅
│
├─ pago:uuid-pag-789 ✅
├─ pago:uuid-pag-790 ✅
│
├─ destajista:uuid-dest-1 (Abraham) ✅
├─ destajista:uuid-dest-2 (Benito) ✅
│
├─ avance:uuid-av-001 ✅
├─ avance:uuid-av-002 ✅
└─ avance:uuid-av-003 ✅
```

### Dashboard Obra 228:

```
┌────────────────────────────────────────────┐
│  🏗️ CASTELLO TORRE F/G/H (228)            │
├────────────────────────────────────────────┤
│                                            │
│  Presupuesto Total: $15,000,000            │
│                                            │
│  Gastado:                                  │
│  ├─ Material: $173,720                     │
│  ├─ Mano Obra: $125,000                    │
│  └─ Total: $298,720 (1.99%)                │
│                                            │
│  Pagado: $298,720                          │
│  Por Pagar: $0                             │
│                                            │
│  Actividad:                                │
│  ├─ Requisiciones: 3                       │
│  ├─ Órdenes Compra: 2                      │
│  ├─ Facturas: 2                            │
│  ├─ Pagos: 4 (2 material, 2 mano obra)     │
│  └─ Destajistas Activos: 5                 │
│                                            │
│  Avance Físico: 15%                        │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔄 DIAGRAMA COMPLETO DE FLUJO

```
                    ┌──────────────┐
                    │  DASHBOARD   │
                    │              │
                    │ CREA OBRA    │
                    │   (228)      │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │REQUISIC. │    │ DESTAJOS │    │ (FUTURO) │
    │          │    │          │    │ INGRESOS │
    │ Solicita │    │ Captura  │    └──────────┘
    │ Material │    │ Avances  │
    └────┬─────┘    └────┬─────┘
         │               │
         ▼               │
    ┌──────────┐         │
    │ COMPRAS  │◄────────┘
    │          │
    │ Crea OC  │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  PAGOS   │
    │          │
    │ Procesa  │
    │ $ SALIDA │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │DASHBOARD │
    │          │
    │Actualiza │
    │ Métricas │
    └──────────┘
```

---

## 🎯 PUNTOS CLAVE DEL SISTEMA

### 1️⃣ **LA OBRA ES EL CENTRO**
```
SIN OBRA → NO HAY NADA
CON OBRA → TODO FUNCIONA
```

### 2️⃣ **DOS TIPOS DE GASTOS**
```
MATERIAL:
Requisición → Compra → Factura → Pago

MANO DE OBRA:
Destajista → Avance → Revisión → Pago
```

### 3️⃣ **DATOS COMPARTIDOS**
```
Todos los módulos leen del MISMO KV Store
Lo que crea COMPRAS, lo ve PAGOS
Lo que crea DESTAJOS, lo ve DASHBOARD
```

### 4️⃣ **FLUJO SECUENCIAL**
```
DASHBOARD crea obra
    ↓
REQUISICIONES solicita material
    ↓
COMPRAS compra material
    ↓
PAGOS paga material
    ↓
DASHBOARD actualiza métricas
```

### 5️⃣ **ESTADOS VISUALES**
```
Todos los componentes tienen:
├─ LOADING (cargando desde API)
├─ EMPTY (sin datos)
└─ WITH DATA (mostrando información)
```

---

## ✅ RESUMEN EJECUTIVO

**El sistema funciona así:**

1. **Gerente** crea obra en Dashboard
2. **Residente** solicita material en Requisiciones
3. **Comprador** crea orden en Compras (basada en requisición)
4. **Residente** confirma que llegó el material
5. **Proveedor** envía factura
6. **Contador** registra factura en Pagos
7. **Contador** programa y procesa pago
8. **Residente** captura destajos semanales
9. **Residente** revisa y aprueba destajos
10. **Contador** paga a destajistas
11. **Dashboard** muestra todo consolidado

**Todos los módulos trabajan juntos, compartiendo la misma base de datos.**

---

**Documento creado:** 2025-02-09  
**Tipo:** Flujo Maestro del Sistema  
**Estado:** Documentación completa del ciclo operativo
