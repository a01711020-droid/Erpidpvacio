// Página: Dashboards por Obra
import { Building2 } from "lucide-react";

export default function DashboardObras() {
  const obras = [
    { codigo: "228", nombre: "CASTELLO TORRE F/G/H", cliente: "CASTELLO INMOBILIARIO" },
    { codigo: "229", nombre: "CASTELLO TORRE F/G/H", cliente: "CASTELLO INMOBILIARIO" },
    { codigo: "230", nombre: "DOZA TORRE A", cliente: "DESARROLLOS DOZA" },
    { codigo: "231", nombre: "DOZA TORRE C", cliente: "DESARROLLOS DOZA" },
    { codigo: "232", nombre: "BALVANERA", cliente: "GRUPO BALVANERA" },
    { codigo: "233", nombre: "BALVANERA", cliente: "GRUPO BALVANERA" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Dashboards por Obra</h2>
        <p className="text-slate-600">Selecciona una obra para ver su dashboard individual</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {obras.map((obra) => (
          <a
            key={obra.codigo}
            href={`/dashboard/obras/${obra.codigo}`}
            className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded">
                    {obra.codigo}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {obra.nombre}
                </h3>
                <p className="text-sm text-slate-600">
                  {obra.cliente}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
