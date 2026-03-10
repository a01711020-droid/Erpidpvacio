// Página: Dashboard de Obra Individual
import { useParams } from "react-router";
import { Building2, ArrowLeft } from "lucide-react";

export default function DashboardObraDetalle() {
  const { codigoObra } = useParams();

  return (
    <div>
      <div className="mb-6">
        <a
          href="/dashboard/obras"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a todas las obras
        </a>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Dashboard Obra {codigoObra}</h2>
            <p className="text-slate-600">Métricas y KPIs de la obra</p>
          </div>
        </div>
      </div>

      {/* TODO: Implementar dashboard individual con componentes existentes */}
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">
          Dashboard individual de la obra {codigoObra} - Próximamente
        </p>
      </div>
    </div>
  );
}
