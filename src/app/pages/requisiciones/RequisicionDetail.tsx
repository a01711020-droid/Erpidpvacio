// Página: Detalle de Requisición
import { useParams } from "react-router";

export default function RequisicionDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Requisición {id}</h2>
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Detalle de requisición - Próximamente</p>
      </div>
    </div>
  );
}
