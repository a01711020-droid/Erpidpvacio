# 📚 DOCUMENTACIÓN COMPLETA - ERP CONSTRUCTORA IDP

## 🎯 ÍNDICE DE DOCUMENTACIÓN

Esta carpeta contiene la documentación completa del sistema ERP, incluyendo especificaciones técnicas y flujos operativos de cada módulo.

---

## 📋 DOCUMENTOS DISPONIBLES

### 1️⃣ **ESPECIFICACIONES TÉCNICAS**

#### [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md)
- Esquema completo de 11 tablas del sistema
- Tipos TypeScript para todas las entidades
- Relaciones y foreign keys
- Estrategia de implementación con KV Store

#### [`ARQUITECTURA_MODULAR.md`](./ARQUITECTURA_MODULAR.md)
- Concepto de módulos independientes por departamento
- Matriz de permisos por rol
- Estructura de rutas protegidas
- Navegación interna de cada módulo

#### [`OBRA_NUCLEO_SISTEMA.md`](./OBRA_NUCLEO_SISTEMA.md)
- La OBRA como centro absoluto del sistema
- Jerarquía de datos (OBRA → Requisiciones/Destajos → Compras → Pagos)
- Flujo operativo completo
- Obra = Sucursal = Centro de costo

#### [`SISTEMA_CONECTADO.md`](./SISTEMA_CONECTADO.md)
- Arquitectura cliente-servidor implementada
- API REST con todos los endpoints
- Sin mocks locales - todo desde base de datos
- Conexión entre todos los módulos

#### [`IMPLEMENTACION_RUTAS_LAYOUTS.md`](./IMPLEMENTACION_RUTAS_LAYOUTS.md)
- Sistema de rutas con React Router
- 5 Layouts específicos por módulo
- 25+ páginas creadas y organizadas
- Sistema de navegación contextual

---

### 2️⃣ **MÓDULOS OPERATIVOS**

#### [`MODULO_DASHBOARD.md`](./MODULO_DASHBOARD.md)
**Centro de Control - Gerencia**

📥 **Qué necesita:**
- Ningún pre-requisito (punto de inicio)

📤 **Qué crea:**
- ✅ **OBRAS** (la entidad más importante)
- ✅ Métricas consolidadas por obra
- ✅ Dashboards individuales

🔗 **Relaciones:**
- CREA obras que habilitan todos los demás módulos
- LEE datos de Compras, Pagos, Destajos, Requisiciones

---

#### [`MODULO_REQUISICIONES.md`](./MODULO_REQUISICIONES.md)
**Solicitudes de Material - Residente/Almacenista**

📥 **Qué necesita:**
- ⚠️ **OBRA activa** (creada en Dashboard)

📤 **Qué crea:**
- ✅ **REQUISICIONES** de material
- ✅ Items de requisición
- ✅ Solicitudes formales

🔗 **Relaciones:**
- DEPENDE de Dashboard (necesita obra)
- ALIMENTA a Compras (sus requisiciones se convierten en OC)

---

#### [`MODULO_COMPRAS.md`](./MODULO_COMPRAS.md)
**Gestión de Órdenes de Compra - Comprador**

📥 **Qué necesita:**
- ⚠️ **OBRA activa** (creada en Dashboard)
- ⚠️ **PROVEEDORES** registrados
- 📋 Opcionalmente: Requisiciones aprobadas

📤 **Qué crea:**
- ✅ **PROVEEDORES** (catálogo)
- ✅ **ÓRDENES DE COMPRA** (compromiso de pago)
- ✅ Relación OC ← Requisición

🔗 **Relaciones:**
- DEPENDE de Dashboard (necesita obra)
- RECIBE de Requisiciones (convierte REQ en OC)
- ALIMENTA a Pagos (sus OC generan facturas)
- ACTUALIZA Dashboard (gastado por obra)

---

#### [`MODULO_PAGOS.md`](./MODULO_PAGOS.md)
**Gestión de Pagos y Facturas - Contador**

📥 **Qué necesita:**
- ⚠️ **ORDEN DE COMPRA** recibida (de Compras)
- ⚠️ **FACTURA** del proveedor (XML + PDF)

📤 **Qué crea:**
- ✅ **FACTURAS** registradas
- ✅ **PAGOS** programados
- ✅ **PAGOS** procesados (salida real de dinero)

🔗 **Relaciones:**
- DEPENDE de Compras (necesita OC)
- RECIBE facturas físicas de proveedores
- ACTUALIZA Dashboard (pagado por obra)
- CIERRA ciclo: Requisición → OC → Factura → Pago ✅

---

#### [`MODULO_DESTAJOS.md`](./MODULO_DESTAJOS.md)
**Control de Avances de Obra - Residente**

📥 **Qué necesita:**
- ⚠️ **OBRA activa** (creada en Dashboard)
- ⚠️ **DESTAJISTAS** registrados

📤 **Qué crea:**
- ✅ **DESTAJISTAS** (catálogo)
- ✅ **AVANCES** semanales (mano de obra)
- ✅ Tabla Excel de captura

🔗 **Relaciones:**
- DEPENDE de Dashboard (necesita obra)
- ALIMENTA a Pagos (avances generan pagos a destajistas)
- ACTUALIZA Dashboard (costo mano de obra)
- PARALELO a Compras (Destajos = mano obra, Compras = material)

---

### 3️⃣ **FLUJO MAESTRO**

#### [`FLUJO_MAESTRO_SISTEMA.md`](./FLUJO_MAESTRO_SISTEMA.md)
**Flujo Completo del Sistema desde Cero**

📖 **Contenido:**
- Día 0: Sistema vacío
- Día 1: Gerente crea primera obra
- Día 2: Residente solicita material
- Día 3: Comprador crea proveedor y OC
- Día 7: Contador registra factura
- Día 30: Contador procesa pago
- Día 10-14: Residente captura destajos
- Estado final del sistema

🎯 **Muestra:**
- Cómo todos los módulos trabajan juntos
- Flujo secuencial de datos
- Estados del KV Store en cada paso
- Dashboard actualizándose automáticamente

---

## 🗂️ CÓMO USAR ESTA DOCUMENTACIÓN

### Para **Desarrolladores**:
1. Lee primero: `DATABASE_SCHEMA.md`
2. Luego: `SISTEMA_CONECTADO.md`
3. Implementa: Revisa cada `MODULO_*.md` según lo que vayas a programar

### Para **Gerencia/Product Owners**:
1. Lee: `FLUJO_MAESTRO_SISTEMA.md` (entender el negocio)
2. Luego: Cada `MODULO_*.md` según el departamento
3. Opcional: `OBRA_NUCLEO_SISTEMA.md` (por qué la obra es tan importante)

### Para **Usuarios Finales**:
1. Lee solo tu módulo:
   - Gerente → `MODULO_DASHBOARD.md`
   - Residente → `MODULO_REQUISICIONES.md` + `MODULO_DESTAJOS.md`
   - Comprador → `MODULO_COMPRAS.md`
   - Contador → `MODULO_PAGOS.md`

---

## 📊 DIAGRAMA GENERAL

```
                    ┌──────────────┐
                    │  DASHBOARD   │ ← Gerente crea OBRAS
                    │              │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │REQUISIC. │    │ DESTAJOS │    │ INGRESOS │
    │Residente │    │Residente │    │ (Futuro) │
    └────┬─────┘    └────┬─────┘    └──────────┘
         │               │
         │ Solicita      │ Captura
         │ Material      │ Avances
         │               │
         ▼               │
    ┌──────────┐         │
    │ COMPRAS  │◄────────┘
    │Comprador │
    │          │
    │ Crea OC  │
    └────┬─────┘
         │
         │ OC → Factura
         │
         ▼
    ┌──────────┐
    │  PAGOS   │
    │ Contador │
    │          │
    │ Procesa  │
    │ $ SALIDA │
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │DASHBOARD │ ← Consolida TODO
    │ Métricas │
    └──────────┘
```

---

## 🎯 REGLAS ABSOLUTAS DEL SISTEMA

### ✅ **Reglas Técnicas:**
1. **Sin obra = sin nada** - La obra es obligatoria en todo
2. **Sin mocks** - Todos los datos vienen del KV Store
3. **3 estados siempre** - Loading, Empty, WithData
4. **Componentes puros** - Solo reciben props y muestran
5. **API centralizada** - Todos usan `/src/app/utils/api.ts`

### ✅ **Reglas de Negocio:**
1. **OBRA → REQUISICIÓN → COMPRA → PAGO** (flujo material)
2. **OBRA → DESTAJO → REVISIÓN → PAGO** (flujo mano de obra)
3. **Crear OC ≠ Pagar** - OC es compromiso, Pago es salida real
4. **Factura vincula OC con Pago** - Documento fiscal obligatorio
5. **Dashboard consolida TODO** - Métricas en tiempo real

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
/spec/
├── README_DOCUMENTACION.md ← Estás aquí
│
├── DATABASE_SCHEMA.md
├── ARQUITECTURA_MODULAR.md
├── OBRA_NUCLEO_SISTEMA.md
├── SISTEMA_CONECTADO.md
├── IMPLEMENTACION_RUTAS_LAYOUTS.md
│
├── MODULO_DASHBOARD.md
├── MODULO_REQUISICIONES.md
├── MODULO_COMPRAS.md
├── MODULO_PAGOS.md
├── MODULO_DESTAJOS.md
│
└── FLUJO_MAESTRO_SISTEMA.md
```

---

## 🚀 ESTADO DEL PROYECTO

### ✅ Completado:
- [x] Especificación de base de datos
- [x] Arquitectura modular documentada
- [x] Servidor con endpoints REST
- [x] Cliente API centralizado
- [x] Rutas y layouts implementados
- [x] Documentación de cada módulo
- [x] Flujo maestro documentado

### 🚧 En Progreso:
- [ ] Migrar componentes existentes a usar API
- [ ] Implementar estados Loading/Empty/WithData
- [ ] Agregar selector de obra en headers
- [ ] Crear datos iniciales (seeds)

### 📋 Pendiente:
- [ ] Autenticación con Supabase (opcional)
- [ ] Filtrado por obras asignadas
- [ ] Reportes en PDF/Excel
- [ ] Módulo de Ingresos (futuro)

---

## 📞 CONTACTO

**Proyecto:** ERP Constructora IDP  
**Fecha:** 2025-02-09  
**Estado:** ✅ Sistema completamente documentado

---

**🎯 PRÓXIMO PASO:**  
Lee `FLUJO_MAESTRO_SISTEMA.md` para entender cómo todo trabaja junto.
