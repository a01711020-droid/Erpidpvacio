import { Card } from "./components/ui/card";
import {
  ShoppingCart,
  CreditCard,
  ClipboardList,
  LayoutDashboard,
  ArrowRight,
  Building2,
  Users,
  TrendingUp,
  Warehouse,
  HardHat,
  UserCog,
} from "lucide-react";

type Module = "dashboard" | "requisitions" | "purchases" | "payments" | "warehouse" | "destajos" | "personal";

interface HomeProps {
  onSelectModule: (module: Module) => void;
  userRole: "admin" | "residente" | "compras" | "pagos";
  userName: string;
}

// Configuración de módulos
const modules = [
  {
    id: "dashboard" as Module,
    title: "Panel General",
    description: "Resumen ejecutivo de todas las obras y métricas empresariales",
    icon: LayoutDashboard,
    colorFrom: "#64748b", // Gris pizarra
    colorTo: "#475569", // Gris más oscuro (serio, ejecutivo)
    iconBg: "bg-white",
    shadowColor: "shadow-slate-200",
    hoverShadow: "hover:shadow-slate-300",
    allowedRoles: ["admin"],
  },
  {
    id: "requisitions" as Module,
    title: "Requisiciones",
    description: "Solicitudes de materiales desde obra con sistema de aprobaciones",
    icon: ClipboardList,
    colorFrom: "#eab308", // Amarillo vibrante
    colorTo: "#f97316", // Naranja (urgencia, materiales)
    iconBg: "bg-white",
    shadowColor: "shadow-amber-200",
    hoverShadow: "hover:shadow-amber-300",
    allowedRoles: ["admin", "residente", "compras"],
  },
  {
    id: "purchases" as Module,
    title: "Compras",
    description: "Órdenes de compra, gestión de proveedores y generación de PDFs",
    icon: ShoppingCart,
    colorFrom: "#3b82f6", // Azul cielo
    colorTo: "#1d4ed8", // Azul más profundo (confianza, profesional)
    iconBg: "bg-white",
    shadowColor: "shadow-blue-200",
    hoverShadow: "hover:shadow-blue-300",
    allowedRoles: ["admin", "compras"],
  },
  {
    id: "payments" as Module,
    title: "Pagos",
    description: "Control de pagos a proveedores y vinculación con órdenes de compra",
    icon: CreditCard,
    colorFrom: "#22c55e", // Verde fresco
    colorTo: "#16a34a", // Verde más profundo (dinero, finanzas)
    iconBg: "bg-white",
    shadowColor: "shadow-green-200",
    hoverShadow: "hover:shadow-green-300",
    allowedRoles: ["admin", "pagos"],
  },
  {
    id: "destajos" as Module,
    title: "Destajos",
    description: "Gestión de destajos por obra y captura semanal de avances",
    icon: HardHat,
    colorFrom: "#d97706", // Ámbar/Tierra
    colorTo: "#92400e", // Marrón tierra (construcción, trabajo físico)
    iconBg: "bg-white",
    shadowColor: "shadow-amber-200",
    hoverShadow: "hover:shadow-amber-300",
    allowedRoles: ["admin", "residente"],
  },
  {
    id: "warehouse" as Module,
    title: "Almacén",
    description: "Control de almacén, recepción de materiales y gestión de remisiones",
    icon: Warehouse,
    colorFrom: "#f97316", // Naranja
    colorTo: "#ea580c", // Naranja profundo (almacén, materiales, logística)
    iconBg: "bg-white",
    shadowColor: "shadow-orange-200",
    hoverShadow: "hover:shadow-orange-300",
    allowedRoles: ["admin"],
  },
  {
    id: "personal" as Module,
    title: "Personal",
    description: "Gestión de empleados y control de asignación a obras",
    icon: UserCog,
    colorFrom: "#374151", // Gris oscuro (gray-700)
    colorTo: "#111827", // Gris muy oscuro (gray-900)
    iconBg: "bg-white",
    shadowColor: "shadow-gray-500/50",
    hoverShadow: "hover:shadow-gray-600/60",
    allowedRoles: ["admin"],
  },
];

export default function Home({ onSelectModule, userRole, userName }: HomeProps) {
  const hasAccess = (allowedRoles: string[]) => {
    return allowedRoles.includes(userRole);
  };

  const accessibleModules = modules.filter((module) =>
    hasAccess(module.allowedRoles)
  );

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)'
    }}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b-4 border-slate-600 shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/logo-idp-normal.svg"
                alt="IDP Construcción"
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Caveat', cursive" }}>
              Sistema de Gestión Empresarial
            </h1>
            <p className="text-xl text-slate-300 mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
              IDP Construcción, Consultoría y Diseño
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-full mt-4">
              <Users className="h-5 w-5 text-slate-300" />
              <span className="text-slate-200" style={{ fontFamily: "'Caveat', cursive" }}>
                Bienvenido, <span className="font-semibold text-white">{userName}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 capitalize" style={{ fontFamily: "'Caveat', cursive" }}>
                {userRole === "admin"
                  ? "Administrador"
                  : userRole === "residente"
                  ? "Residente de Obra"
                  : userRole === "compras"
                  ? "Departamento de Compras"
                  : "Departamento de Pagos"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Selection - Círculos */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Caveat', cursive" }}>
            Selecciona un Módulo
          </h2>
          <p className="text-xl text-gray-600" style={{ fontFamily: "'Caveat', cursive" }}>
            Elige el área del sistema que deseas gestionar
          </p>
        </div>

        {/* 4 círculos arriba */}
        <div className="flex justify-center gap-8 mb-12 flex-wrap">
          {accessibleModules.slice(0, 4).map((module) => {
            const Icon = module.icon;
            const isComingSoon = module.comingSoon;
            
            return (
              <div
                key={module.id}
                className={`flex flex-col items-center ${
                  isComingSoon ? "opacity-75" : "cursor-pointer"
                }`}
                onClick={() => !isComingSoon && onSelectModule(module.id)}
              >
                <div className="relative">
                  <div
                    className={`w-28 h-28 rounded-full ${
                      isComingSoon ? "" : "hover:scale-110"
                    } transition-all duration-300 shadow-lg ${module.shadowColor} ${
                      isComingSoon ? "" : module.hoverShadow
                    } flex items-center justify-center group`}
                    style={{
                      background: `linear-gradient(135deg, ${module.colorFrom}, ${module.colorTo})`,
                    }}
                  >
                    <Icon className={`h-12 w-12 text-white ${
                      isComingSoon ? "" : "group-hover:scale-110"
                    } transition-transform duration-300`} />
                  </div>
                  {isComingSoon && (
                    <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      PRONTO
                    </div>
                  )}
                </div>
                <h3
                  className="mt-4 text-xl font-bold text-gray-900 text-center max-w-[140px]"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: "24px" }}
                >
                  {module.title}
                </h3>
              </div>
            );
          })}
        </div>

        {/* 3 círculos abajo */}
        {accessibleModules.length > 4 && (
          <div className="flex justify-center gap-8 flex-wrap">
            {accessibleModules.slice(4, 7).map((module) => {
              const Icon = module.icon;
              const isComingSoon = module.comingSoon;
              
              return (
                <div
                  key={module.id}
                  className={`flex flex-col items-center ${
                    isComingSoon ? "opacity-75" : "cursor-pointer"
                  }`}
                  onClick={() => !isComingSoon && onSelectModule(module.id)}
                >
                  <div className="relative">
                    <div
                      className={`w-28 h-28 rounded-full ${
                        isComingSoon ? "" : "hover:scale-110"
                      } transition-all duration-300 shadow-lg ${module.shadowColor} ${
                        isComingSoon ? "" : module.hoverShadow
                      } flex items-center justify-center group`}
                      style={{
                        background: `linear-gradient(135deg, ${module.colorFrom}, ${module.colorTo})`,
                      }}
                    >
                      <Icon className={`h-12 w-12 text-white ${
                        isComingSoon ? "" : "group-hover:scale-110"
                      } transition-transform duration-300`} />
                    </div>
                    {isComingSoon && (
                      <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        PRONTO
                      </div>
                    )}
                  </div>
                  <h3
                    className="mt-4 text-xl font-bold text-gray-900 text-center max-w-[140px]"
                    style={{ fontFamily: "'Caveat', cursive", fontSize: "24px" }}
                  >
                    {module.title}
                  </h3>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-4 border-slate-600 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo-idp-normal.svg" alt="IDP" className="h-12 w-auto" />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-white">
                  IDP Construcción, Consultoría y Diseño
                </p>
                <p>Sistema de Gestión Empresarial v1.0</p>
              </div>
            </div>
            <div className="text-sm text-slate-300">
              © 2025 Todos los derechos reservados
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}