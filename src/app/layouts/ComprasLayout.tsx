// Layout para el Módulo Compras
import { Outlet, Link } from "react-router";
import { ShoppingCart, FileText, Users, Package, Home } from "lucide-react";

export default function ComprasLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
              <h1 className="text-xl font-bold text-slate-900">Compras</h1>
            </div>
            <span className="text-sm text-slate-500">|</span>
            <span className="text-sm text-slate-600">Gestión de Órdenes de Compra</span>
          </div>
          
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4 space-y-1">
            <Link
              to="/compras/ordenes"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
            >
              <FileText className="w-4 h-4" />
              Órdenes de Compra
            </Link>
            
            <Link
              to="/compras/proveedores"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
            >
              <Users className="w-4 h-4" />
              Proveedores
            </Link>
            
            <div className="pt-4 mt-4 border-t border-slate-200">
              <Link
                to="/compras/ordenes/nueva"
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
              >
                <Package className="w-4 h-4" />
                Nueva Orden de Compra
              </Link>
            </div>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}