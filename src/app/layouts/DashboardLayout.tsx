// Layout para el Módulo Dashboard
import { Outlet, Link } from "react-router";
import { LayoutDashboard, Building2, Home } from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            </div>
            <span className="text-sm text-slate-500">|</span>
            <span className="text-sm text-slate-600">Constructora IDP</span>
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
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Global
            </Link>
            
            <Link
              to="/dashboard/obras"
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Dashboards por Obra
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