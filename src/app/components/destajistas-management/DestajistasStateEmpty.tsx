/**
 * DESTAJISTAS - Estado Empty
 * Homólogo a la vista completa de Destajistas
 */

import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Users, Plus } from "lucide-react";

interface Props {
  onBack?: () => void;
  onAdd?: () => void;
}

export default function DestajistasStateEmpty({ onBack, onAdd }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)",
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b-4 border-teal-600 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Button>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Gestión de Destajistas
                </h1>
                <p className="text-teal-100 text-lg">
                  Administra los destajistas y sus identificadores únicos
                </p>
              </div>
            </div>
            <Button
              onClick={onAdd}
              className="bg-white text-teal-800 hover:bg-teal-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Destajista
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Destajistas Activos
            </h2>
            <p className="text-gray-600">Total de 0 destajistas registrados</p>
          </div>

          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              No hay destajistas registrados
            </p>
            <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
              Agrega los destajistas que trabajarán en las obras para poder
              asignarles pagos y tareas.
            </p>
            {onAdd && (
              <Button onClick={onAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Destajista
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
