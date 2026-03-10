// Página 404 - No Encontrada
import { useNavigate } from "react-router";
import { FileQuestion, Home } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icono */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
            <FileQuestion className="w-10 h-10 text-slate-600" />
          </div>

          {/* Mensaje */}
          <h1 className="text-6xl font-bold text-slate-900 mb-3">
            404
          </h1>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Página No Encontrada
          </h2>
          <p className="text-slate-600 mb-8">
            La página que estás buscando no existe o ha sido movida.
          </p>

          {/* Botón */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
