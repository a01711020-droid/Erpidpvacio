# ARQUITECTURA MODULAR DEL SISTEMA ERP - IDP CONSTRUCTORA

## 🎯 CONCEPTO FUNDAMENTAL

Este NO es un sistema monolítico donde todos los usuarios acceden a todo.  
Este ES un sistema modular donde **cada departamento tiene su propia aplicación dedicada**.

---

## 🏗️ ESTRUCTURA REAL DEL SISTEMA

### MODO DESARROLLO (Actual - Temporal)
```
┌─────────────────────────────────────┐
│           HOME (DEV)                │
│  ┌──────────────────────────────┐  │
│  │  • Dashboard Global          │  │
│  │  • Módulo Compras            │  │
│  │  │  • Módulo Pagos            │  │
│  │  • Módulo Destajos           │  │
│  │  • Módulo Requisiciones      │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```
✅ Solo para desarrollo y demostración  
✅ Permite navegar entre todos los módulos  
✅ NO es la experiencia real de producción

---

### MODO PRODUCCIÓN (Real)
```
┌─────────────────────────────────────────────────────────┐
│                    EMPRESA IDP                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │  GERENCIA    │  │   COMPRAS    │  │ CONTABILIDAD│  │
│  │  Dashboard   │  │   Módulo     │  │   Pagos     │  │
│  │              │  │              │  │             │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │   OBRA       │  │   ALMACÉN    │                    │
│  │  Destajos    │  │ Requisiciones│                    │
│  │              │  │              │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 MÓDULOS INDEPENDIENTES

### 1️⃣ MÓDULO DASHBOARD
**Usuarios:** Dirección General, Gerencia, Ejecutivos  
**Punto de Entrada:** `/dashboard`

#### Sub-módulos INTERNOS:
```
/dashboard
  /dashboard/global          → Dashboard General de la Empresa
  /dashboard/obras           → Dashboard por Obra Individual
  /dashboard/obras/:codigo   → Detalle de una Obra Específica
  /dashboard/reportes        → Reportes Ejecutivos
  /dashboard/comparativas    → Comparativas entre Obras
```

#### Navegación:
- ✅ PUEDE navegar entre dashboards (global ↔ obra)
- ✅ PUEDE ver todas las obras
- ✅ PUEDE ver todos los indicadores
- ❌ NO PUEDE acceder a Compras directamente
- ❌ NO PUEDE acceder a Pagos directamente
- ❌ NO PUEDE acceder a Destajos directamente

#### Datos que consume:
- Resumen de todas las órdenes de compra (agregado)
- Resumen de todos los pagos (agregado)
- Resumen de todos los destajos (agregado)
- KPIs globales de todas las obras

---

### 2️⃣ MÓDULO COMPRAS
**Usuarios:** Departamento de Compras, Compradores  
**Punto de Entrada:** `/compras`

#### Sub-módulos INTERNOS:
```
/compras
  /compras/ordenes                   → Lista de Órdenes de Compra
  /compras/ordenes/nueva             → Crear Nueva OC
  /compras/ordenes/:id               → Detalle/Edición de OC
  /compras/proveedores               → Catálogo de Proveedores
  /compras/proveedores/nuevo         → Agregar Proveedor
  /compras/proveedores/:id           → Detalle/Edición Proveedor
  /compras/requisiciones             → Requisiciones Pendientes
  /compras/requisiciones/:id         → Convertir Req → OC
```

#### Navegación:
- ✅ PUEDE navegar entre órdenes y proveedores
- ✅ PUEDE crear, editar, cancelar OCs
- ✅ PUEDE gestionar catálogo de proveedores
- ✅ PUEDE ver requisiciones y convertirlas a OCs
- ❌ NO PUEDE ver Dashboard
- ❌ NO PUEDE acceder a Pagos
- ❌ NO PUEDE ver Destajos

#### Datos que consume:
- Órdenes de compra (CRUD completo)
- Proveedores (CRUD completo)
- Requisiciones (solo lectura + conversión)
- Obras (solo lectura para asociar OCs)

---

### 3️⃣ MÓDULO PAGOS
**Usuarios:** Departamento de Contabilidad, Tesorería, Finanzas  
**Punto de Entrada:** `/pagos`

#### Sub-módulos INTERNOS:
```
/pagos
  /pagos/programacion            → Programación Semanal de Pagos
  /pagos/facturas                → Gestión de Facturas
  /pagos/facturas/nueva          → Registrar Nueva Factura
  /pagos/facturas/:id            → Detalle/Edición Factura
  /pagos/procesar                → Procesar Pagos Programados
  /pagos/historial               → Historial de Pagos
  /pagos/conciliacion            → Conciliación Bancaria
```

#### Navegación:
- ✅ PUEDE programar pagos (totales o parciales)
- ✅ PUEDE registrar facturas recibidas
- ✅ PUEDE procesar pagos
- ✅ PUEDE ver historial completo
- ✅ PUEDE ver órdenes de compra (solo lectura, para referencia)
- ❌ NO PUEDE crear órdenes de compra
- ❌ NO PUEDE ver Dashboard
- ❌ NO PUEDE ver Destajos

#### Datos que consume:
- Pagos (CRUD completo)
- Facturas (CRUD completo)
- Órdenes de compra (solo lectura)
- Proveedores (solo lectura)
- Obras (solo lectura)

---

### 4️⃣ MÓDULO DESTAJOS
**Usuarios:** Residentes de Obra, Superintendentes  
**Punto de Entrada:** `/destajos`

#### Sub-módulos INTERNOS:
```
/destajos
  /destajos/catalogo             → Catálogo de Destajistas
  /destajos/catalogo/nuevo       → Agregar Destajista
  /destajos/catalogo/:id         → Editar Destajista
  /destajos/captura              → Captura Semanal de Avances
  /destajos/captura/:semana      → Captura de Semana Específica
  /destajos/resumen              → Resumen por Obra y Destajista
  /destajos/resumen/:obra        → Resumen de una Obra
```

#### Navegación:
- ✅ PUEDE gestionar catálogo de destajistas
- ✅ PUEDE capturar avances semanales
- ✅ PUEDE ver resúmenes por obra
- ✅ PUEDE exportar/importar catálogos
- ❌ NO PUEDE ver Dashboard Global
- ❌ NO PUEDE acceder a Compras
- ❌ NO PUEDE acceder a Pagos
- ⚠️ PUEDE ver SOLO sus obras asignadas

#### Datos que consume:
- Destajistas (CRUD completo)
- Avances de destajos (CRUD completo)
- Obras (solo lectura, filtradas por asignación)

---

### 5️⃣ MÓDULO REQUISICIONES
**Usuarios:** Residentes de Obra, Almacenistas, Jefes de Obra  
**Punto de Entrada:** `/requisiciones`

#### Sub-módulos INTERNOS:
```
/requisiciones
  /requisiciones/nueva           → Crear Nueva Requisición
  /requisiciones/pendientes      → Requisiciones Pendientes
  /requisiciones/:id             → Detalle/Edición Requisición
  /requisiciones/aprobadas       → Requisiciones Aprobadas
  /requisiciones/historial       → Historial de Requisiciones
```

#### Navegación:
- ✅ PUEDE crear requisiciones de material
- ✅ PUEDE editar requisiciones pendientes
- ✅ PUEDE ver historial de sus requisiciones
- ❌ NO PUEDE ver Dashboard
- ❌ NO PUEDE acceder a Compras (solo solicitar)
- ❌ NO PUEDE acceder a Pagos
- ⚠️ PUEDE ver SOLO las requisiciones de sus obras

#### Datos que consume:
- Requisiciones (CRUD completo)
- Items de requisiciones (CRUD completo)
- Obras (solo lectura, filtradas por asignación)

---

## 🔐 SISTEMA DE AUTENTICACIÓN Y PERMISOS

### Roles de Usuario:

```typescript
export type UserRole = 
  | "admin"           // Acceso total a todo
  | "gerente"         // Dashboard + lectura de otros módulos
  | "comprador"       // Solo Módulo Compras
  | "contador"        // Solo Módulo Pagos
  | "residente"       // Destajos + Requisiciones (solo sus obras)
  | "almacenista"     // Solo Requisiciones
  | "ejecutivo";      // Solo Dashboard (lectura)
```

### Matriz de Permisos:

| Rol | Dashboard | Compras | Pagos | Destajos | Requisiciones |
|-----|-----------|---------|-------|----------|---------------|
| **admin** | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| **gerente** | ✅ CRUD | 👁️ Lectura | 👁️ Lectura | 👁️ Lectura | 👁️ Lectura |
| **comprador** | ❌ | ✅ CRUD | ❌ | ❌ | 👁️ Lectura |
| **contador** | ❌ | 👁️ Lectura | ✅ CRUD | ❌ | ❌ |
| **residente** | ❌ | ❌ | ❌ | ✅ CRUD* | ✅ CRUD* |
| **almacenista** | ❌ | ❌ | ❌ | ❌ | ✅ CRUD* |
| **ejecutivo** | 👁️ Lectura | ❌ | ❌ | ❌ | ❌ |

\* Solo obras asignadas

---

## 🛣️ ESTRUCTURA DE RUTAS

### Rutas Públicas:
```typescript
/                        → Login / Redirect según rol
/login                   → Página de Login
/logout                  → Cerrar sesión
```

### Rutas Protegidas por Rol:

```typescript
// ADMIN - Acceso total + Panel de administración
/admin/*

// DASHBOARD - Gerencia/Ejecutivos
/dashboard/*
  - Requiere rol: gerente, ejecutivo, admin

// COMPRAS - Departamento de Compras
/compras/*
  - Requiere rol: comprador, admin
  - Lectura: gerente

// PAGOS - Contabilidad/Finanzas
/pagos/*
  - Requiere rol: contador, admin
  - Lectura: gerente

// DESTAJOS - Residentes de Obra
/destajos/*
  - Requiere rol: residente, admin
  - Filtrado por obras asignadas

// REQUISICIONES - Almacén/Residentes
/requisiciones/*
  - Requiere rol: residente, almacenista, admin
  - Filtrado por obras asignadas
```

---

## 🎨 LAYOUTS POR MÓDULO

Cada módulo tiene su propio layout y navegación:

### Layout Dashboard:
```tsx
<DashboardLayout>
  <DashboardHeader />
  <DashboardSidebar>
    - Dashboard Global
    - Dashboards por Obra
    - Reportes
    - Comparativas
  </DashboardSidebar>
  <Outlet />
</DashboardLayout>
```

### Layout Compras:
```tsx
<ComprasLayout>
  <ComprasHeader />
  <ComprasSidebar>
    - Órdenes de Compra
    - Proveedores
    - Requisiciones Pendientes
  </ComprasSidebar>
  <Outlet />
</ComprasLayout>
```

### Layout Pagos:
```tsx
<PagosLayout>
  <PagosHeader />
  <PagosSidebar>
    - Programación Semanal
    - Facturas
    - Procesar Pagos
    - Historial
  </PagosSidebar>
  <Outlet />
</PagosLayout>
```

### Layout Destajos:
```tsx
<DestajosLayout>
  <DestajosHeader />
  <DestajosSidebar>
    - Catálogo Destajistas
    - Captura Semanal
    - Resumen por Obra
  </DestajosSidebar>
  <Outlet />
</DestajosLayout>
```

---

## 🔄 FLUJO DE DATOS ENTRE MÓDULOS

### Aunque los módulos son independientes para usuarios, los DATOS están conectados:

#### Ejemplo 1: Flujo de Requisición → Compra → Pago

```
1. RESIDENTE (Módulo Requisiciones)
   └─> Crea requisición de material
       ↓
       [Base de Datos]
       ↓
2. COMPRADOR (Módulo Compras)
   └─> Ve requisición pendiente
   └─> Crea orden de compra desde requisición
       ↓
       [Base de Datos]
       ↓
3. CONTADOR (Módulo Pagos)
   └─> Ve orden de compra con factura pendiente
   └─> Registra factura
   └─> Programa pago
```

#### Ejemplo 2: Visualización en Dashboard

```
GERENTE (Módulo Dashboard)
   └─> Dashboard Global
       ├─> Consume datos de Compras (agregados)
       ├─> Consume datos de Pagos (agregados)
       ├─> Consume datos de Destajos (agregados)
       └─> Consume datos de Requisiciones (agregados)
       
       [Solo lectura, sin navegación directa a los módulos]
```

---

## 🚀 IMPLEMENTACIÓN TÉCNICA

### 1. Sistema de Rutas con React Router:

```typescript
// /src/app/routes.ts
import { createBrowserRouter, redirect } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: async () => {
      const user = await getAuthenticatedUser();
      if (!user) return redirect("/login");
      
      // Redirigir según rol
      switch (user.rol) {
        case "gerente":
        case "ejecutivo":
          return redirect("/dashboard");
        case "comprador":
          return redirect("/compras");
        case "contador":
          return redirect("/pagos");
        case "residente":
          return redirect("/destajos");
        case "almacenista":
          return redirect("/requisiciones");
        default:
          return redirect("/login");
      }
    }
  },
  
  // Módulo Dashboard
  {
    path: "/dashboard",
    Component: DashboardLayout,
    loader: requireAuth(["gerente", "ejecutivo", "admin"]),
    children: [
      { index: true, Component: DashboardGlobal },
      { path: "obras", Component: DashboardObras },
      { path: "obras/:codigo", Component: DashboardObraDetalle },
      { path: "reportes", Component: DashboardReportes },
    ]
  },
  
  // Módulo Compras
  {
    path: "/compras",
    Component: ComprasLayout,
    loader: requireAuth(["comprador", "admin"]),
    children: [
      { index: true, Component: OrdenesCompraList },
      { path: "ordenes/nueva", Component: OrdenCompraCreate },
      { path: "ordenes/:id", Component: OrdenCompraDetail },
      { path: "proveedores", Component: ProveedoresList },
      { path: "proveedores/nuevo", Component: ProveedorCreate },
      { path: "proveedores/:id", Component: ProveedorDetail },
    ]
  },
  
  // Módulo Pagos
  {
    path: "/pagos",
    Component: PagosLayout,
    loader: requireAuth(["contador", "admin"]),
    children: [
      { index: true, Component: PagosProgramacion },
      { path: "facturas", Component: FacturasList },
      { path: "facturas/nueva", Component: FacturaCreate },
      { path: "procesar", Component: PagosProcesar },
      { path: "historial", Component: PagosHistorial },
    ]
  },
  
  // Módulo Destajos
  {
    path: "/destajos",
    Component: DestajosLayout,
    loader: requireAuth(["residente", "admin"]),
    children: [
      { index: true, Component: DestajistasCatalogo },
      { path: "captura", Component: CapturaAvances },
      { path: "resumen", Component: ResumenDestajos },
    ]
  },
  
  // Módulo Requisiciones
  {
    path: "/requisiciones",
    Component: RequisicionesLayout,
    loader: requireAuth(["residente", "almacenista", "admin"]),
    children: [
      { index: true, Component: RequisicionesList },
      { path: "nueva", Component: RequisicionCreate },
      { path: ":id", Component: RequisicionDetail },
    ]
  },
]);
```

### 2. Helper de Autenticación:

```typescript
// /src/utils/auth.ts
export async function requireAuth(allowedRoles: UserRole[]) {
  return async () => {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      throw redirect("/login");
    }
    
    if (!allowedRoles.includes(user.rol)) {
      throw redirect("/unauthorized");
    }
    
    return { user };
  };
}
```

### 3. Filtrado de Datos por Obras Asignadas:

```typescript
// /src/utils/permissions.ts
export function filterByAssignedObras<T extends { obra_id: string }>(
  data: T[],
  user: Usuario
): T[] {
  // Admin y gerente ven todas las obras
  if (user.rol === "admin" || user.rol === "gerente") {
    return data;
  }
  
  // Otros roles solo ven sus obras asignadas
  if (!user.obras_asignadas || user.obras_asignadas.length === 0) {
    return [];
  }
  
  return data.filter(item => 
    user.obras_asignadas!.includes(item.obra_id)
  );
}
```

---

## 📝 RESUMEN EJECUTIVO

### ✅ REGLAS DE ORO:

1. **Cada módulo es una aplicación independiente** con su propia navegación y layout
2. **Los usuarios solo ven su módulo** según su rol en la empresa
3. **No hay navegación cruzada** entre módulos (excepto admin)
4. **Los datos están conectados** pero la UI está separada
5. **El HOME de desarrollo es temporal** y no existe en producción
6. **Cada departamento trabaja en su espacio** sin interferir con otros

### 🎯 VENTAJAS:

- ✅ **Seguridad**: Usuarios solo ven lo que necesitan
- ✅ **Simplicidad**: Interfaz enfocada en tareas específicas
- ✅ **Performance**: Carga solo lo necesario para cada rol
- ✅ **Escalabilidad**: Fácil agregar nuevos módulos
- ✅ **Mantenimiento**: Cambios en un módulo no afectan otros
- ✅ **UX**: Experiencia optimizada por departamento

---

**Documento creado:** 2025-02-09  
**Versión:** 1.0  
**Estado:** ✅ Definición arquitectónica completa
