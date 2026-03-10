// Página: Detalle de Proveedor
import { useParams } from "react-router";

export default function ProveedorDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Proveedor {id}</h2>
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Detalle de proveedor - Próximamente</p>
      </div>
    </div>
  );
}
