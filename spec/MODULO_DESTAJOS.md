# 🔨 MÓDULO DESTAJOS - Control de Avances de Obra

## 🎯 PROPÓSITO

El módulo de Destajos es donde:
- Los **residentes de obra** registran avances semanales
- Se documenta el trabajo de cada **destajista**  
- Se calculan pagos por trabajo realizado (no por material)
- Se monitorea el avance físico de la construcción

**Usuarios:** Residente de Obra, Administrador

---

## 📥 INFORMACIÓN QUE NECESITA (INPUTS)

### 1. **Obra Activa (Pre-requisito)**
```typescript
// La obra DEBE existir
{
  obra_id: "uuid-228",
  codigo_obra: "228",
  nombre_obra: "CASTELLO TORRE F/G/H",
  estado: "activa"
}
```

### 2. **Destajista Registrado**
```typescript
{
  destajista_id: "uuid-dest-1",
  codigo: "AG",                         // Iniciales únicas
  nombre_completo: "Abraham García",
  telefono: "8123456789",
  especialidad: "Albañilería",
  color_asignado: "#FF6B6B",           // Color para tabla
  activo: true
}
```

### 3. **Avance Semanal**
```typescript
{
  // OBLIGATORIO
  obra_id: "uuid-228",                  // En qué obra trabaja
  destajista_id: "uuid-dest-1",         // Quién trabajó
  
  // Período
  año: 2025,
  semana: 6,                            // Semana ISO (1-52)
  
  // Descripción del trabajo
  concepto: "Losa armada N1",           // Qué hizo
  cantidad: 50,                         // Cuánto hizo
  unidad: "M²",                         // Unidad de medida
  
  // Pago
  precio_unitario: 500,                 // $/M²
  monto_total: 25000,                   // cantidad × precio_unitario
  
  // Estado
  estado: "capturado"  // capturado | revisado | pagado
}
```

---

## 📤 INFORMACIÓN QUE CREA (OUTPUTS)

### 1. **DESTAJISTA**

```typescript
// Se guarda en KV Store
Clave: "destajista:uuid-dest-1"

Valor: {
  destajista_id: "uuid-dest-1",
  codigo: "AG",
  nombre_completo: "Abraham García",
  telefono: "8123456789",
  especialidad: "Albañilería",
  color_asignado: "#FF6B6B",
  activo: true,
  created_at: "2025-01-15T08:00:00Z",
  updated_at: "2025-01-15T08:00:00Z"
}
```

### 2. **AVANCE DE DESTAJO (Entidad Principal)**

```typescript
// Se guarda en KV Store
Clave: "avance:uuid-av-001"

Valor: {
  avance_id: "uuid-av-001",
  obra_id: "uuid-228",               // ← Relacionado con obra
  destajista_id: "uuid-dest-1",      // ← Relacionado con destajista
  año: 2025,
  semana: 6,
  concepto: "Losa armada N1",
  cantidad: 50,
  unidad: "M²",
  precio_unitario: 500,
  monto_total: 25000,
  estado: "capturado",
  created_at: "2025-02-09T16:00:00Z",
  updated_at: "2025-02-09T16:00:00Z"
}
```

### 3. **¿Qué Habilita Esto?**

✅ **Para el Módulo de Pagos:**
- Los avances "revisados" generan compromisos de pago a destajistas
- Similar a facturas, pero son pagos por mano de obra
- Se programan y procesan pagos semanales

✅ **Para el Dashboard:**
- Dashboard ve: "Avance físico obra 228: 15%"
- Métricas de productividad por destajista
- Costos de mano de obra por obra

✅ **Para la Obra:**
- Residente sabe quién trabajó y cuánto
- Historial de avances por semana
- Seguimiento de rendimientos

---

## 🔄 FLUJO OPERATIVO

### PASO 1: Gestión de Destajistas

```
Usuario Residente abre módulo Destajos
    ↓
[Tab Catálogo Destajistas]
    ↓
[Ver Lista] → GET /api/destajistas
    ↓
¿Existe el destajista?
    ├─ SÍ → Usar existente
    └─ NO → Registrar nuevo
        ↓
        [Formulario Nuevo Destajista]
            ├─ Código: AG (iniciales)
            ├─ Nombre: Abraham García
            ├─ Teléfono: 8123456789
            ├─ Especialidad: Albañilería
            └─ Color: [🎨 Selector de color]
        ↓
        POST /api/destajistas
        ↓
        Destajista disponible en sistema
```

### PASO 2: Captura Semanal de Avances (Tabla Excel)

```
Usuario abre "Captura Semanal"
    ↓
[Selecciona]
    ├─ Obra: CASTELLO F/G/H (228)
    ├─ Semana: 6 / 2025
    └─ Sistema carga avances existentes
    ↓
[Tabla tipo Excel]
    ┌─────────────┬───────┬───────┬───────┬───────┬───────┐
    │ Destajista  │ Lun   │ Mar   │ Mié   │ Jue   │ Vie   │
    ├─────────────┼───────┼───────┼───────┼───────┼───────┤
    │ AG Abraham  │ [AG]  │ [AG]  │       │       │       │
    │ BC Benito   │ [BC]  │       │ [BC]  │       │       │
    │ CD Carlos   │       │       │       │ [CD]  │ [CD]  │
    └─────────────┴───────┴───────┴───────┴───────┴───────┘
    
    Usuario hace clic en celda
    ↓
    [Modal de captura]
        ├─ Concepto: [Losa armada N1_______]
        ├─ Cantidad: [50]
        ├─ Unidad: [M² ▼]
        ├─ Precio: [$500/M²]
        ├─ Total: $25,000 (auto-calculado)
        └─ [Guardar]
    ↓
    POST /api/avances
    ↓
    [Celda se pinta con color del destajista]
    [Muestra tooltip con concepto y monto]
```

### PASO 3: Revisar y Aprobar Avances

```
Fin de semana
    ↓
Usuario Residente revisa capturas
    ↓
[Lista de avances de la semana]
    ├─ Estado: "Capturado" (amarillo)
    └─ Muestra: Destajista, Concepto, Monto
    ↓
[Valida cada avance]
    ├─ ¿Cantidad correcta?
    ├─ ¿Precio acordado?
    └─ ¿Trabajo realmente hecho?
    ↓
[Clic] "Marcar como Revisado"
    ↓
PUT /api/avances/:id
estado = "revisado"
    ↓
[Avances revisados listos para pago]
```

### PASO 4: Generar Resumen por Obra

```
Usuario abre "Resumen por Obra"
    ↓
[Selecciona] Obra y Período (mes/semana)
    ↓
[Sistema genera reporte]
    ├─ Total por destajista
    ├─ Total por concepto
    ├─ Gráfica de avance
    └─ Comparativa de rendimientos
    ↓
[Puede exportar a PDF/Excel]
```

---

## 📊 PANTALLAS DEL MÓDULO

### 1. **Catálogo de Destajistas** (`/destajos/catalogo`)

```
┌────────────────────────────────────────────┐
│  👷 Catálogo de Destajistas                │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 🟥 AG - Abraham García               │ │
│  │ Especialidad: Albañilería            │ │
│  │ Teléfono: 8123456789                 │ │
│  │ Obras activas: 2                     │ │
│  │ Avance este mes: $125,000            │ │
│  │ [Editar] [Ver Historial]             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 🟦 BC - Benito Cruz                  │ │
│  │ Especialidad: Plomería               │ │
│  │ Teléfono: 8129876543                 │ │
│  │ Obras activas: 1                     │ │
│  │ Avance este mes: $80,000             │ │
│  │ [Editar] [Ver Historial]             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [+ Nuevo Destajista]                      │
│                                            │
│  Total Destajistas: 32 (28 activos)        │
│                                            │
└────────────────────────────────────────────┘
```

### 2. **Captura Semanal** (`/destajos/captura`)

```
┌────────────────────────────────────────────┐
│  📝 Captura Semanal de Avances             │
├────────────────────────────────────────────┤
│                                            │
│  Obra: [CASTELLO F/G/H (228) ▼]           │
│  Semana: [6 ▼] Año: [2025 ▼]              │
│  Período: 10-Feb a 14-Feb                  │
│                                            │
│  ┌────────────────────────────────────────┐│
│  │     │ LUN│ MAR│ MIÉ│ JUE│ VIE│ TOTAL ││
│  ├─────┼────┼────┼────┼────┼────┼───────││
│  │AG   │🟥  │🟥  │    │    │    │$50k   ││
│  │     │Losa│Muro│    │    │    │       ││
│  ├─────┼────┼────┼────┼────┼────┼───────││
│  │BC   │    │    │🟦  │🟦  │    │$35k   ││
│  │     │    │    │Plom│Plom│    │       ││
│  ├─────┼────┼────┼────┼────┼────┼───────││
│  │CD   │    │    │    │    │🟩  │$40k   ││
│  │     │    │    │    │    │Elec│       ││
│  └─────┴────┴────┴────┴────┴────┴───────┘│
│                                            │
│  Total Semana: $125,000                    │
│                                            │
│  [Exportar Excel] [Marcar Revisada]        │
│                                            │
└────────────────────────────────────────────┘

Al hacer clic en celda:
┌─────────────────────────────┐
│  Avance - Abraham García    │
├─────────────────────────────┤
│  Lunes 10-Feb-2025          │
│                             │
│  Concepto:                  │
│  [Losa armada N1_________]  │
│                             │
│  Cantidad: [50] [M² ▼]      │
│                             │
│  Precio/unidad: [$500]      │
│                             │
│  Total: $25,000.00          │
│                             │
│  [Cancelar] [Guardar]       │
└─────────────────────────────┘
```

### 3. **Resumen por Obra** (`/destajos/resumen`)

```
┌────────────────────────────────────────────┐
│  📊 Resumen de Destajos                    │
├────────────────────────────────────────────┤
│                                            │
│  Obra: CASTELLO F/G/H (228)                │
│  Período: Febrero 2025                     │
│                                            │
│  Resumen por Destajista:                   │
│  ┌──────────────────────────────────────┐ │
│  │ Abraham García (AG)                  │ │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  $125,000      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Benito Cruz (BC)                     │ │
│  │ ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  $80,000       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ Carlos Domínguez (CD)                │ │
│  │ ▓▓▓▓▓▓▓░░░░░░░░░░░░░  $65,000       │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  Total Mano de Obra: $270,000              │
│  Promedio Semanal: $67,500                 │
│                                            │
│  [Exportar PDF] [Ver Gráfica]              │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔗 RELACIONES CON OTROS MÓDULOS

### Dashboard → Destajos
```
Dashboard CREA obra 228
    ↓
Destajos VE obra 228 en selector
    ↓
✅ Puede capturar avances para esa obra
```

### Destajos → Pagos
```
Destajos CAPTURA avance de Abraham García
Concepto: "Losa armada N1"
Monto: $25,000
Estado: "Revisado"
    ↓
Pagos VE avances revisados
    ↓
Pagos PROGRAMA pago a destajista
    ↓
Pagos PROCESA pago (transferencia/efectivo)
```

### Destajos → Dashboard (lectura)
```
Destajos tiene 15 avances en obra 228
Total: $270,000 en mano de obra
    ↓
Dashboard LEE todos los avances
    ↓
Dashboard MUESTRA:
    ├─ Costo mano de obra: $270,000
    ├─ 5 destajistas activos
    └─ Avance físico: 15%
```

---

## 📋 REGLAS DE NEGOCIO

### ✅ Al Registrar Destajista:
1. **Código único** - Iniciales únicas (2-3 letras)
2. **Color único** - Para identificar en tabla
3. **Teléfono** - Para contacto
4. **Especialidad** - Albañilería, Plomería, Electricidad, etc.

### ✅ Al Capturar Avance:
1. **Obra obligatoria** - Debe estar en obra activa
2. **Destajista registrado** - Debe existir en catálogo
3. **Semana válida** - Entre 1 y 52
4. **Cantidad > 0** - No se permiten negativos
5. **Monto auto-calculado** - cantidad × precio_unitario
6. **Estado inicial** - "capturado"

### ✅ Estados del Avance:
- **Capturado** 🟡 - Recién ingresado por residente
- **Revisado** 🟢 - Validado, listo para pago
- **Pagado** ✅ - Ya se le pagó al destajista

### ⚠️ Validaciones:
- No se puede editar un avance "pagado"
- No se puede eliminar un avance con pago asociado
- Precio unitario debe ser razonable (validación manual)

---

## 🔧 API QUE USA

```typescript
import { 
  obrasApi,           // Leer obras para selector
  destajistasApi,     // CRUD de destajistas
  avancesApi         // CRUD de avances
} from '@/app/utils/api';
```

---

## 📊 EJEMPLO COMPLETO

### Lunes 10-Feb: Residente registra avance
```
Usuario: Ing. Carlos Méndez (Residente)
Obra: CASTELLO F/G/H (228)

1. Abre /destajos/captura
2. Selecciona:
   - Obra: 228
   - Semana: 6 / 2025
3. Tabla carga vacía (nueva semana)
4. Clic en celda: Abraham García × Lunes
5. Modal abre:
   - Concepto: "Losa armada N1"
   - Cantidad: 50 M²
   - Precio: $500/M²
   - Total: $25,000 ✅
6. Clic "Guardar"

Resultado:
✅ Avance capturado
✅ Celda se pinta roja (color de AG)
✅ Muestra "Losa" en celda
✅ Tooltip: "Losa armada N1 - $25,000"
```

### Viernes 14-Feb: Residente captura más
```
Usuario: Ing. Carlos Méndez

1. Abre la misma semana 6/2025
2. Tabla muestra avances anteriores
3. Captura:
   - Benito Cruz × Miércoles: Plomería $15k
   - Benito Cruz × Jueves: Plomería $20k
   - Carlos Domínguez × Viernes: Electricidad $40k

Resultado:
✅ 4 avances capturados en la semana
✅ Total semana: $100,000
```

### Domingo 16-Feb: Residente revisa
```
Usuario: Ing. Carlos Méndez

1. Abre lista de avances
2. Filtra: Semana 6/2025, Estado "Capturado"
3. Ve los 4 avances
4. Valida cada uno:
   - ¿Se hizo el trabajo? ✅
   - ¿Cantidad correcta? ✅
   - ¿Precio acordado? ✅
5. Selecciona todos
6. Clic "Marcar como Revisados"

Resultado:
✅ 4 avances estado: "Revisado"
✅ Listos para que Pagos los pague
```

### Lunes 17-Feb: Contador programa pagos
```
Usuario: Laura Martínez (Contador)
Módulo: Pagos

1. Ve 4 avances revisados de semana 6
2. Programa pagos:
   - Abraham García: $25,000
   - Benito Cruz: $35,000
   - Carlos Domínguez: $40,000
3. Fecha: Viernes 21-Feb

Resultado:
✅ Pagos programados
✅ Viernes se les paga a los destajistas
```

---

## 🎯 PUNTO CLAVE

**DESTAJOS = MANO DE OBRA**

```
REQUISICIONES → Material
COMPRAS → Material
PAGOS → Material

DESTAJOS → Mano de Obra
PAGOS → Mano de Obra
```

Destajos documenta el trabajo humano, no los materiales.  
Es complementario a Compras, NO es lo mismo.

---

**Documento creado:** 2025-02-09  
**Módulo:** Destajos  
**Rol:** Residente - Captura avances semanales de destajistas
