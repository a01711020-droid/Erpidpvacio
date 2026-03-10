// Layout para el Módulo Destajos
import { Outlet, Link } from "react-router";
import { Hammer, Users, ClipboardList, BarChart3, Home } from "lucide-react";

export default function DestajosLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Hammer className="w-6 h-6 text-orange-600" />
              <h1 className="text-xl font-bold text-slate-900">Destajos</h1>
            </div>
            <span className="text-sm text-slate-500">|</span>
            <span className="text-sm text-slate-600">Control de Avances de Obra</span>
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
              to="/destajos/catalogo"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors"
            >
              <Users className="w-4 h-4" />
              Catálogo Destajistas
            </Link>
            
            <Link
              to="/destajos/captura"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors"
            >
              <ClipboardList className="w-4 h-4" />
              Captura Semanal
            </Link>
            
            <Link
              to="/destajos/resumen"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Resumen por Obra
            </Link>
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