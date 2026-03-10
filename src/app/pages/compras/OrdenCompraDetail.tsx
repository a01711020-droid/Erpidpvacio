// Página: Detalle de Orden de Compra
import { useParams } from "react-router";

export default function OrdenCompraDetail() {
  const { id } = useParams();
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Orden de Compra {id}</h2>
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Detalle de orden - Próximamente</p>
      </div>
    </div>
  );
}
