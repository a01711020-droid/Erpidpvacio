# LA OBRA COMO NÚCLEO DEL SISTEMA ERP

## 🎯 CONCEPTO FUNDAMENTAL

**LA OBRA ES EL CENTRO ABSOLUTO DEL SISTEMA**

En un ERP tradicional de retail/manufactura:
- **SUCURSAL** = Centro del negocio
- Todo parte de la sucursal (ventas, inventario, compras)

En nuestro ERP de Constructora:
- **OBRA** = Centro del negocio
- Todo parte de la obra (requisiciones, compras, pagos, destajos)

---

## 🏗️ JERARQUÍA DEL SISTEMA

```
                    ┌─────────────────────┐
                    │                     │
                    │       OBRA          │
                    │  (Centro Absoluto)  │
                    │                     │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
         ┌────────────┐  ┌──────────┐  ┌──────────┐
         │REQUISICIONES│  │ DESTAJOS │  │ INGRESOS │
         └──────┬─────┘  └────┬─────┘  └──────────┘
                │             │
                ▼             │
         ┌────────────┐       │
         │  COMPRAS   │◄──────┘
         └──────┬─────┘
                │
                ▼
         ┌────────────┐
         │   PAGOS    │
         └────────────┘
```

---

## 🔄 FLUJO DE DATOS (TODO PARTE DE LA OBRA)

### 1️⃣ **Sin OBRA = Sin Sistema**
```
❌ NO HAY OBRA
   ↓
❌ NO HAY REQUISICIONES
❌ NO HAY DESTAJOS
❌ NO HAY COMPRAS
❌ NO HAY PAGOS
❌ NO HAY DASHBOARD
```

### 2️⃣ **Con OBRA = Sistema Completo**
```
✅ OBRA CREADA
   │
   ├─> ✅ Se pueden crear REQUISICIONES
   ├─> ✅ Se pueden registrar DESTAJOS
   ├─> ✅ Se pueden emitir COMPRAS
   └─> ✅ Se pueden programar PAGOS
       └─> ✅ Dashboard tiene datos que mostrar
```

---

## 📊 FLUJO OPERATIVO COMPLETO

### Escenario Real: Construcción de CASTELLO TORRE F/G/H (Obra 228)

```
PASO 1: OBRA ACTIVA
┌─────────────────────────────────────────────────────┐
│ OBRA: CASTELLO F/G/H (228)                         │
│ Estado: ACTIVA                                      │
│ Cliente: CASTELLO INMOBILIARIO                      │
│ Residente: Ing. Carlos Méndez                       │
└─────────────────────────────────────────────────────┘
                     ↓
PASO 2a: REQUISICIÓN DE MATERIAL
┌─────────────────────────────────────────────────────┐
│ REQUISICIÓN: REQ-228-001                           │
│ Obra: 228 ← OBLIGATORIO                            │
│ Solicitante: Ing. Carlos Méndez                     │
│ Material: Cemento, Acero, Block                     │
└─────────────────────────────────────────────────────┘
                     ↓
PASO 2b: DESTAJO PROGRAMADO
┌─────────────────────────────────────────────────────┐
│ DESTAJO: Semana 6-2025                             │
│ Obra: 228 ← OBLIGATORIO                            │
│ Destajista: Abraham Garcia (AG)                    │
│ Concepto: Losa armada N1                           │
└─────────────────────────────────────────────────────┘
                     ↓
PASO 3: COMPRA DE MATERIAL
┌─────────────────────────────────────────────────────┐
│ ORDEN COMPRA: 228-A01GM-CEMEX                      │
│ Obra: 228 ← OBLIGATORIO                            │
│ Origen: REQ-228-001                                 │
│ Proveedor: CEMEX                                    │
│ Material: Cemento 150 bultos                        │
└─────────────────────────────────────────────────────┘
                     ↓
PASO 4: RECEPCIÓN DE FACTURA
┌─────────────────────────────────────────────────────┐
│ FACTURA: FAC-CEMEX-12345                           │
│ Obra: 228 ← OBLIGATORIO                            │
│ OC: 228-A01GM-CEMEX                                 │
│ Monto: $45,000.00                                   │
│ Vencimiento: 30 días                                │
└─────────────────────────────────────────────────────┘
                     ↓
PASO 5: PAGO A PROVEEDOR
┌─────────────────────────────────────────────────────┐
│ PAGO: PAG-228-001                                   │
│ Obra: 228 ← OBLIGATORIO                            │
│ Proveedor: CEMEX                                    │
│ Monto: $45,000.00                                   │
│ Método: Transferencia                               │
└─────────────────────────────────────────────────────┘
                     ↓
PASO 6: DASHBOARD CONSOLIDA
┌─────────────────────────────────────────────────────┐
│ DASHBOARD OBRA 228                                  │
│ - Requisiciones: 1 ($45,000)                        │
│ - Compras: 1 OC ($45,000)                          │
│ - Pagos: 1 ($45,000)                               │
│ - Destajos: 1 cuadrilla                            │
│ - Avance: 15% completado                            │
└─────────────────────────────────────────────────────┘
```

---

## 🗂️ OBRA COMO FOREIGN KEY OBLIGATORIA

### Todas las entidades requieren `obra_id`:

```typescript
// ❌ INCORRECTO - No se puede crear sin obra
const requisicion = {
  folio: "REQ-001",
  // obra_id: ??? ← FALTA
  solicitante: "Juan Pérez",
  items: [...]
}
// ERROR: No se puede guardar

// ✅ CORRECTO - Siempre con obra
const requisicion = {
  folio: "REQ-228-001",
  obra_id: "uuid-obra-228", // ← OBLIGATORIO
  solicitante: "Juan Pérez",
  items: [...]
}
// OK: Se puede guardar
```

### Esquema de FK en todas las tablas:

```sql
-- REQUISICIONES
requisiciones.obra_id → obras.obra_id (NOT NULL)

-- ÓRDENES DE COMPRA
ordenes_compra.obra_id → obras.obra_id (NOT NULL)

-- FACTURAS
facturas.obra_id → obras.obra_id (NOT NULL)

-- PAGOS
pagos.obra_id → obras.obra_id (NOT NULL)

-- DESTAJOS
avances_destajos.obra_id → obras.obra_id (NOT NULL)
```

---

## 🎯 OBRA = SUCURSAL = CENTRO DE COSTO

### Comparación con ERP Tradicional:

| ERP Retail/Manufactura | ERP Constructora IDP |
|------------------------|----------------------|
| Sucursal Matriz | OBRA: CASTELLO F/G/H |
| Sucursal Norte | OBRA: DOZA TORRE A |
| Sucursal Sur | OBRA: BALVANERA |
| | |
| **Cada sucursal tiene:** | **Cada obra tiene:** |
| - Inventario | - Requisiciones |
| - Ventas | - Compras |
| - Compras | - Pagos |
| - Gastos | - Destajos |
| - Personal | - Residentes |
| | |
| **Dashboard por sucursal** | **Dashboard por obra** |
| **Consolidado corporativo** | **Dashboard global** |

---

## 🔐 PERMISOS BASADOS EN OBRA

### Usuarios asignados a obras específicas:

```typescript
// Usuario Residente - Solo ve sus obras
const residenteCastello = {
  usuario_id: "uuid-1",
  nombre: "Ing. Carlos Méndez",
  rol: "residente",
  obras_asignadas: ["uuid-obra-228", "uuid-obra-229"] // Solo CASTELLO
}

// Al consultar requisiciones:
const requisiciones = await getRequisiciones();
// Automáticamente filtrado:
// WHERE obra_id IN ("uuid-obra-228", "uuid-obra-229")

// ❌ NO PUEDE ver requisiciones de DOZA (obras 230, 231)
// ❌ NO PUEDE ver requisiciones de BALVANERA (obras 232, 233)
```

### Admin y Gerente ven todas las obras:

```typescript
const gerente = {
  usuario_id: "uuid-2",
  nombre: "Lic. María González",
  rol: "gerente",
  obras_asignadas: null // null = TODAS las obras
}

// Dashboard Global muestra:
// - CASTELLO: $X millones
// - DOZA: $Y millones  
// - BALVANERA: $Z millones
// - TOTAL: $X+Y+Z millones
```

---

## 📦 ESTADOS DE UNA OBRA

### Ciclo de Vida:

```
1. ACTIVA
   └─> La obra está en construcción
       ✅ Se pueden crear requisiciones
       ✅ Se pueden registrar destajos
       ✅ Se pueden emitir compras
       ✅ Se pueden programar pagos

2. SUSPENDIDA
   └─> La obra está pausada temporalmente
       ⚠️ No se pueden crear nuevos movimientos
       ✅ Se pueden consultar datos históricos

3. TERMINADA
   └─> La obra finalizó exitosamente
       ❌ No se pueden crear movimientos
       ✅ Se pueden consultar reportes finales
       ✅ Se puede cerrar contabilidad

4. CANCELADA
   └─> La obra se canceló
       ❌ No se pueden crear movimientos
       ⚠️ Requiere cierre administrativo
```

---

## 🚀 IMPLICACIONES EN EL CÓDIGO

### 1. Selector de Obra Obligatorio

**En todos los módulos debe haber selector de obra:**

```tsx
// Módulo Requisiciones
<RequisicionesLayout>
  <Header>
    <ObraSelector 
      value={obraActual}
      onChange={setObraActual}
      obras={obrasAsignadas}
    />
  </Header>
  <RequisicionesList obra_id={obraActual.obra_id} />
</RequisicionesLayout>
```

### 2. Validación en Formularios

```tsx
// Al crear cualquier entidad
<FormularioRequisicion>
  <input type="hidden" name="obra_id" value={obraActual.obra_id} required />
  {/* El usuario NO puede cambiar la obra aquí */}
  {/* Solo desde el selector global del header */}
</FormularioRequisicion>
```

### 3. Queries Filtradas por Obra

```typescript
// Siempre filtrar por obra_id
async function getRequisiciones(obra_id: string) {
  const key = `requisicion:index:obra:${obra_id}`;
  const requisicionIds = await kv.get(key);
  return requisicionIds.map(id => kv.get(`requisicion:${id}`));
}

// ❌ NUNCA hacer:
async function getAllRequisiciones() {
  // Esto traería datos de TODAS las obras
  // Potencial violación de seguridad
}
```

### 4. Dashboard Jerárquico

```tsx
// Dashboard Global (Gerente)
<DashboardGlobal>
  {obras.map(obra => (
    <ObraCard key={obra.obra_id}>
      <h3>{obra.nombre_obra}</h3>
      <p>Compras: {getComprasTotal(obra.obra_id)}</p>
      <p>Pagos: {getPagosTotal(obra.obra_id)}</p>
      <p>Destajos: {getDestajosTotal(obra.obra_id)}</p>
      <Link to={`/dashboard/obras/${obra.codigo_obra}`}>
        Ver Detalle
      </Link>
    </ObraCard>
  ))}
</DashboardGlobal>

// Dashboard Individual (Residente)
<DashboardObra obra_id="uuid-228">
  <h1>CASTELLO F/G/H</h1>
  <RequisicionesResumen obra_id="uuid-228" />
  <ComprasResumen obra_id="uuid-228" />
  <PagosResumen obra_id="uuid-228" />
  <DestajosResumen obra_id="uuid-228" />
</DashboardObra>
```

---

## 📋 REGLAS DE NEGOCIO

### ✅ REGLAS ABSOLUTAS:

1. **Toda entidad DEBE tener obra_id**
   - No se puede crear requisición sin obra
   - No se puede crear compra sin obra
   - No se puede crear pago sin obra
   - No se puede capturar destajo sin obra

2. **El código de folio DEBE incluir código de obra**
   - Requisición: REQ-**228**-001
   - Orden Compra: **228**-A01GM-CEMEX
   - Pago: PAG-**228**-001
   - Avance: AV-**228**-2025-W06

3. **Los usuarios solo ven obras asignadas**
   - Excepto admin y gerente (ven todas)
   - Filtrado automático en todas las queries
   - Validación en servidor

4. **Dashboard consolida por obra**
   - Cada obra tiene sus métricas
   - Dashboard global suma todas las obras
   - Filtros por estado de obra

5. **Reportes siempre incluyen obra**
   - Reporte de compras: agrupado por obra
   - Reporte de pagos: agrupado por obra
   - Reporte de destajos: agrupado por obra

---

## 🎯 RESUMEN EJECUTIVO

### **LA OBRA ES:**

✅ El centro del sistema  
✅ La unidad de negocio  
✅ El filtro principal de datos  
✅ El centro de costo  
✅ La fuente de ingresos  
✅ El contexto de todas las operaciones  

### **SIN OBRA NO HAY:**

❌ Requisiciones  
❌ Compras  
❌ Pagos  
❌ Destajos  
❌ Dashboard  
❌ Sistema  

### **TODAS LAS ENTIDADES DEPENDEN DE OBRA:**

```
OBRA
 ├── Requisiciones → Compras → Pagos
 ├── Destajos → Avances → Pagos
 └── Dashboard → Consolidación → Reportes
```

---

**Documento creado:** 2025-02-09  
**Versión:** 1.0  
**Estado:** ✅ Concepto fundamental documentado
