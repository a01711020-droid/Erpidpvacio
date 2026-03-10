// Configuración de rutas con React Router Data Mode
import { createBrowserRouter } from "react-router";

// ==================== COMPONENTES DE PÁGINAS ====================
// Importar páginas principales
import Home from "./Home";

// Layouts por módulo
import DashboardLayout from "./layouts/DashboardLayout";
import ComprasLayout from "./layouts/ComprasLayout";
import PagosLayout from "./layouts/PagosLayout";
import DestajosLayout from "./layouts/DestajosLayout";
import RequisicionesLayout from "./layouts/RequisicionesLayout";

// Páginas del Dashboard
import GlobalDashboard from "./GlobalDashboard";
import DashboardObras from "./pages/dashboard/DashboardObras";
import DashboardObraDetalle from "./pages/dashboard/DashboardObraDetalle";

// Páginas de Compras
import OrdenesCompraList from "./pages/compras/OrdenesCompraList";
import OrdenCompraCreate from "./pages/compras/OrdenCompraCreate";
import OrdenCompraDetail from "./pages/compras/OrdenCompraDetail";
import ProveedoresList from "./pages/compras/ProveedoresList";
import ProveedorCreate from "./pages/compras/ProveedorCreate";
import ProveedorDetail from "./pages/compras/ProveedorDetail";

// Páginas de Pagos
import PagosProgramacion from "./pages/pagos/PagosProgramacion";
import FacturasList from "./pages/pagos/FacturasList";
import FacturaCreate from "./pages/pagos/FacturaCreate";
import PagosProcesar from "./pages/pagos/PagosProcesar";
import PagosHistorial from "./pages/pagos/PagosHistorial";

// Páginas de Destajos
import DestajistasCatalogo from "./pages/destajos/DestajistasCatalogo";
import CapturaAvances from "./pages/destajos/CapturaAvances";
import ResumenDestajos from "./pages/destajos/ResumenDestajos";

// Páginas de Requisiciones
import RequisicionesList from "./pages/requisiciones/RequisicionesList";
import RequisicionCreate from "./pages/requisiciones/RequisicionCreate";
import RequisicionDetail from "./pages/requisiciones/RequisicionDetail";

// Páginas de error
import NotFoundPage from "./pages/NotFoundPage";

// ==================== CONFIGURACIÓN DE RUTAS ====================

export const router = createBrowserRouter([
  // ========== HOME DE DESARROLLO ==========
  {
    path: "/",
    Component: Home,
  },
  
  // ========== MÓDULO DASHBOARD ==========
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: GlobalDashboard,
      },
      {
        path: "obras",
        Component: DashboardObras,
      },
      {
        path: "obras/:codigoObra",
        Component: DashboardObraDetalle,
      },
    ],
  },
  
  // ========== MÓDULO COMPRAS ==========
  {
    path: "/compras",
    Component: ComprasLayout,
    children: [
      {
        index: true,
        Component: OrdenesCompraList,
      },
      {
        path: "ordenes",
        Component: OrdenesCompraList,
      },
      {
        path: "ordenes/nueva",
        Component: OrdenCompraCreate,
      },
      {
        path: "ordenes/:id",
        Component: OrdenCompraDetail,
      },
      {
        path: "proveedores",
        Component: ProveedoresList,
      },
      {
        path: "proveedores/nuevo",
        Component: ProveedorCreate,
      },
      {
        path: "proveedores/:id",
        Component: ProveedorDetail,
      },
    ],
  },
  
  // ========== MÓDULO PAGOS ==========
  {
    path: "/pagos",
    Component: PagosLayout,
    children: [
      {
        index: true,
        Component: PagosProgramacion,
      },
      {
        path: "programacion",
        Component: PagosProgramacion,
      },
      {
        path: "facturas",
        Component: FacturasList,
      },
      {
        path: "facturas/nueva",
        Component: FacturaCreate,
      },
      {
        path: "procesar",
        Component: PagosProcesar,
      },
      {
        path: "historial",
        Component: PagosHistorial,
      },
    ],
  },
  
  // ========== MÓDULO DESTAJOS ==========
  {
    path: "/destajos",
    Component: DestajosLayout,
    children: [
      {
        index: true,
        Component: DestajistasCatalogo,
      },
      {
        path: "catalogo",
        Component: DestajistasCatalogo,
      },
      {
        path: "captura",
        Component: CapturaAvances,
      },
      {
        path: "resumen",
        Component: ResumenDestajos,
      },
    ],
  },
  
  // ========== MÓDULO REQUISICIONES ==========
  {
    path: "/requisiciones",
    Component: RequisicionesLayout,
    children: [
      {
        index: true,
        Component: RequisicionesList,
      },
      {
        path: "nueva",
        Component: RequisicionCreate,
      },
      {
        path: ":id",
        Component: RequisicionDetail,
      },
    ],
  },
  
  // ========== PÁGINA NO ENCONTRADA ==========
  {
    path: "*",
    Component: NotFoundPage,
  },
]);