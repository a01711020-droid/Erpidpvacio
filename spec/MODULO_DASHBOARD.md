# 📊 MÓDULO DASHBOARD - Centro de Control

## 🎯 PROPÓSITO

El Dashboard es el **módulo de gerencia** donde se:
- Crean y administran las **OBRAS** (el núcleo del sistema)
- Visualizan métricas consolidadas de todas las obras
- Monitorean el estado financiero y operativo
- Toman decisiones estratégicas

**Usuarios:** Gerente, Administrador, Ejecutivos

---

## 📥 INFORMACIÓN QUE NECESITA (INPUTS)

### 1. Para CREAR una Obra:
```typescript
{
  codigo_obra: "228",                    // Código único (228-233)
  nombre_obra: "CASTELLO TORRE F/G/H",   // Nombre descriptivo
  cliente: "CASTELLO INMOBILIARIO",      // Cliente final
  direccion: "Av. Principal #123",       // Ubicación física
  residente: "Ing. Carlos Méndez",       // Ingeniero residente
  fecha_inicio: "2025-01-15",           // Cuándo empezó
  fecha_fin_estimada: "2026-12-31",     // Cuándo termina
  presupuesto_total: 15000000,          // Presupuesto MXN
  estado: "activa"                      // activa | suspendida | terminada
}
```

### 2. Para MOSTRAR Dashboard Global:
- Lista de todas las obras (desde KV Store)
- Órdenes de compra de cada obra (desde API)
- Pagos realizados de cada obra (desde API)
- Avances de destajos de cada obra (desde API)
- Requisiciones de cada obra (desde API)

---

## 📤 INFORMACIÓN QUE CREA (OUTPUTS)

### 1. **OBRA (La entidad más importante del sistema)**

**Al crear una obra:**
```typescript
// Se guarda en KV Store
Clave: "obra:uuid-228"

Valor: {
  obra_id: "uuid-228",
  codigo_obra: "228",
  nombre_obra: "CASTELLO TORRE F/G/H",
  cliente: "CASTELLO INMOBILIARIO",
  estado: "activa",
  presupuesto_total: 15000000,
  created_at: "2025-02-09T10:00:00Z",
  updated_at: "2025-02-09T10:00:00Z"
}
```

**¿Qué habilita esto?**
✅ La obra aparece automáticamente en:
- Módulo Requisiciones (selector de obras)
- Módulo Compras (selector de obras)
- Módulo Pagos (selector de obras)
- Módulo Destajos (selector de obras)

### 2. **Métricas Calculadas**

Para cada obra, calcula en tiempo real:
```typescript
{
  obra_codigo: "228",
  nombre: "CASTELLO F/G/H",
  
  // Métricas financieras
  presupuesto_total: 15000000,
  gastado_a_fecha: 3250000,        // Suma de todas las compras
  pagado_a_fecha: 2800000,         // Suma de todos los pagos
  por_pagar: 450000,               // gastado - pagado
  porcentaje_ejercido: 21.67,      // (gastado / presupuesto) * 100
  
  // Métricas operativas
  total_requisiciones: 15,
  total_ordenes_compra: 12,
  total_facturas: 10,
  total_pagos: 8,
  total_destajistas_activos: 5,
  
  // Estado actual
  estado: "activa",
  dias_transcurridos: 25,
  dias_restantes: 330
}
```

---

## 🔄 FLUJO OPERATIVO

### PASO 1: Crear la Obra
```
Usuario Gerente
    ↓
[Dashboard] → Botón "Nueva Obra"
    ↓
[Formulario] → Captura datos de la obra
    ↓
[Validación] → Código único, presupuesto válido
    ↓
[Guardar] → POST /api/obras
    ↓
[KV Store] → Guarda: obra:uuid-228
    ↓
[Success] → Obra creada, aparece en listado
```

### PASO 2: Visualizar Dashboard Global
```
Usuario abre Dashboard
    ↓
[Loading] → GET /api/obras (todas)
    ↓
Para cada obra:
    ├─ GET /api/ordenes-compra/obra/:id
    ├─ GET /api/pagos/obra/:id
    ├─ GET /api/avances/obra/:id
    └─ GET /api/requisiciones/obra/:id
    ↓
[Calcular] → Métricas por obra
    ↓
[Mostrar] → Cards con resumen de cada obra
```

### PASO 3: Ver Dashboard Individual de Obra
```
Usuario hace clic en "Obra 228"
    ↓
[Ruta] → /dashboard/obras/228
    ↓
[Loading] → GET /api/obras/228
    ↓
[Detalles]:
    ├─ Información de la obra
    ├─ Gráfica de presupuesto vs gastado
    ├─ Top 5 proveedores
    ├─ Última requisición
    ├─ Último pago
    └─ Avance de destajos
```

---

## 📊 PANTALLAS DEL MÓDULO

### 1. **Dashboard Global** (`/dashboard`)

**Elementos:**
```
┌────────────────────────────────────────────┐
│  📊 Dashboard Global - Constructora IDP    │
├────────────────────────────────────────────┤
│                                            │
│  Resumen Corporativo:                      │
│  ┌──────────────┬──────────────┬─────────┐│
│  │ 6 OBRAS      │ $45M TOTAL   │ 65% AVAN││
│  │ ACTIVAS      │ PRESUPUESTO  │   ZE    ││
│  └──────────────┴──────────────┴─────────┘│
│                                            │
│  Obras Activas:                            │
│  ┌─────────────────────────────────────┐  │
│  │ 🏗️ CASTELLO F/G/H (228)            │  │
│  │ Presupuesto: $15M | Gastado: $3.2M  │  │
│  │ ▓▓▓▓▓▓░░░░░░░░░░░░░░ 21.67%        │  │
│  └─────────────────────────────────────┘  │
│                                            │
│  │ 🏗️ DOZA TORRE A (230)               │  │
│  │ Presupuesto: $12M | Gastado: $5.8M  │  │
│  │ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ 48.33%        │  │
│  └─────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

**Acciones:**
- `[+ Nueva Obra]` - Crear obra
- `[Ver Detalle]` - Ir a dashboard individual
- `[Filtrar por Estado]` - Activas, Suspendidas, Terminadas

### 2. **Dashboard Individual** (`/dashboard/obras/228`)

**Elementos:**
```
┌────────────────────────────────────────────┐
│  🏗️ CASTELLO TORRE F/G/H (228)           │
├────────────────────────────────────────────┤
│                                            │
│  Información General:                      │
│  Cliente: CASTELLO INMOBILIARIO            │
│  Residente: Ing. Carlos Méndez             │
│  Inicio: 15-Ene-2025 | Fin: 31-Dic-2026   │
│                                            │
│  Presupuesto:                              │
│  ┌──────────────────────────────────────┐ │
│  │ Total: $15,000,000                   │ │
│  │ Gastado: $3,250,000 (21.67%)        │ │
│  │ Disponible: $11,750,000             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Actividad Reciente:                       │
│  • Requisición REQ-228-005 (Hoy)          │
│  • Pago a CEMEX $45,000 (Ayer)            │
│  • Orden de Compra 228-A01GM (3 días)     │
│                                            │
│  Destajos esta Semana:                     │
│  • 5 destajistas activos                   │
│  • $125,000 en avances capturados          │
│                                            │
└────────────────────────────────────────────┘
```

### 3. **Lista de Obras** (`/dashboard/obras`)

**Grid de obras:**
```
┌────────────────────────────────────────────┐
│  Obras de la Constructora                  │
├────────────────────────────────────────────┤
│                                            │
│  [228] CASTELLO F/G/H                      │
│  Cliente: CASTELLO INMOBILIARIO            │
│  Estado: 🟢 Activa                         │
│  ────────────────────────────────────────  │
│                                            │
│  [229] CASTELLO F/G/H                      │
│  Cliente: CASTELLO INMOBILIARIO            │
│  Estado: 🟢 Activa                         │
│  ────────────────────────────────────────  │
│                                            │
│  [230] DOZA TORRE A                        │
│  Cliente: DESARROLLOS DOZA                 │
│  Estado: 🟢 Activa                         │
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
Puede crear REQ-228-001
```

### Dashboard → Compras
```
Dashboard CREA obra 228
    ↓
Compras VE obra 228 en selector
    ↓
Puede crear OC 228-A01GM-CEMEX
```

### Dashboard ← Compras (lectura)
```
Compras CREA orden $45,000
    ↓
Dashboard LEE todas las órdenes de obra 228
    ↓
Calcula: Gastado = $45,000
    ↓
Muestra: 21.67% del presupuesto ejercido
```

### Dashboard ← Pagos (lectura)
```
Pagos PROCESA pago $45,000
    ↓
Dashboard LEE todos los pagos de obra 228
    ↓
Calcula: Pagado = $45,000
    ↓
Muestra: Saldo pendiente = $0
```

---

## 🎯 ESTADOS DEL MÓDULO

### Estado 1: EMPTY (Sin Obras)
```
┌────────────────────────────────────────────┐
│                                            │
│           📊 Dashboard Global              │
│                                            │
│         No hay obras registradas           │
│                                            │
│      [+ Crear Primera Obra]                │
│                                            │
└────────────────────────────────────────────┘
```

### Estado 2: LOADING (Cargando)
```
┌────────────────────────────────────────────┐
│                                            │
│           📊 Dashboard Global              │
│                                            │
│         ⏳ Cargando información...         │
│                                            │
└────────────────────────────────────────────┘
```

### Estado 3: WITH DATA (Con Obras)
```
[Ver diseño completo arriba]
```

---

## 📋 REGLAS DE NEGOCIO

### ✅ Al Crear Obra:
1. **Código único** - No puede haber dos obras con el mismo código
2. **Presupuesto positivo** - Debe ser mayor a $0
3. **Fechas válidas** - Fecha fin > Fecha inicio
4. **Estado inicial** - Siempre "activa"

### ✅ Al Calcular Métricas:
1. **Gastado** = Suma de todas las órdenes de compra de la obra
2. **Pagado** = Suma de todos los pagos realizados de la obra
3. **Por Pagar** = Gastado - Pagado
4. **% Ejercido** = (Gastado / Presupuesto) × 100

### ⚠️ Alertas:
- Obra con más del 80% de presupuesto → 🟡 Amarillo
- Obra con más del 95% de presupuesto → 🔴 Rojo
- Obra con pagos vencidos → 🔴 Alerta

---

## 🔧 API QUE USA

```typescript
import { 
  obrasApi,           // CRUD de obras
  ordenesCompraApi,   // Leer órdenes para métricas
  pagosApi,          // Leer pagos para métricas
  avancesApi,        // Leer avances para métricas
  requisicionesApi   // Leer requisiciones para métricas
} from '@/app/utils/api';
```

### Llamadas Típicas:

**Crear obra:**
```typescript
await obrasApi.create({
  codigo_obra: "228",
  nombre_obra: "CASTELLO F/G/H",
  cliente: "CASTELLO INMOBILIARIO",
  presupuesto_total: 15000000,
  estado: "activa"
});
```

**Leer todas las obras:**
```typescript
const response = await obrasApi.getAll();
const obras = response.data;
```

**Calcular métricas de una obra:**
```typescript
// Obtener obra
const obra = await obrasApi.getById("uuid-228");

// Obtener datos relacionados
const ordenes = await ordenesCompraApi.getByObra("uuid-228");
const pagos = await pagosApi.getByObra("uuid-228");
const avances = await avancesApi.getByObra("uuid-228");
const requisiciones = await requisicionesApi.getByObra("uuid-228");

// Calcular
const gastado = ordenes.reduce((sum, o) => sum + o.monto_total, 0);
const pagado = pagos.reduce((sum, p) => sum + p.monto, 0);
const porPagar = gastado - pagado;
const porcentajeEjercido = (gastado / obra.presupuesto_total) * 100;
```

---

## 📊 EJEMPLO COMPLETO DE USO

### Día 1: Gerente crea nueva obra
```
1. Usuario: Gerente General
2. Acción: Crear obra CASTELLO F/G/H
3. Datos:
   - Código: 228
   - Presupuesto: $15,000,000
   - Cliente: CASTELLO INMOBILIARIO
   - Residente: Ing. Carlos Méndez
4. Resultado:
   ✅ Obra creada en KV Store
   ✅ Aparece en Dashboard Global
   ✅ Disponible en todos los módulos
```

### Día 2: Residente crea requisición
```
1. Usuario: Ing. Carlos Méndez (Residente)
2. Módulo: Requisiciones
3. Ve: Obra 228 en selector (porque existe)
4. Crea: REQ-228-001 (Cemento 150 bultos)
5. Dashboard ve: 1 requisición activa
```

### Día 3: Comprador crea orden
```
1. Usuario: Juan Pérez (Comprador)
2. Módulo: Compras
3. Ve: Obra 228 en selector
4. Crea: Orden 228-A01GM-CEMEX por $45,000
5. Dashboard ve: 
   - Gastado: $45,000
   - % Ejercido: 0.3%
```

### Día 10: Contador paga factura
```
1. Usuario: Laura Martínez (Contador)
2. Módulo: Pagos
3. Procesa: Pago a CEMEX $45,000
4. Dashboard ve:
   - Gastado: $45,000
   - Pagado: $45,000
   - Por Pagar: $0
```

---

**Documento creado:** 2025-02-09  
**Módulo:** Dashboard (Centro de Control)  
**Rol:** Gerencia - Crea OBRAS y monitorea sistema
