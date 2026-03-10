import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";

interface Props {
  onBack?: () => void;
}

export default function ResumenDestajosStateEmpty({ onBack }: Props) {
  return (
    <div className="space-y-8">
      {/* Título */}
      <div>
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Obras
        </Button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Resumen General de Destajos
        </h2>
        <p className="text-gray-600">
          Desglose de importes por obra y consolidado global de destajistas
        </p>
      </div>

      {/* Estado vacío */}
      <Card className="border-2 border-dashed border-gray-300">
        <div className="p-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gray-100 rounded-full">
              <FileSpreadsheet className="h-16 w-16 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Sin Datos de Destajos
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            No hay información de destajos registrada en las obras actualmente.
            <br />
            Comienza asignando trabajos a destajistas en cada obra.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={onBack} variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ir a Obras
            </Button>
          </div>
        </div>
      </Card>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <span className="text-white text-2xl">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Selecciona una Obra
              </h4>
              <p className="text-sm text-gray-600">
                Elige la obra donde deseas registrar destajos
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <span className="text-white text-2xl">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Asigna Destajistas
              </h4>
              <p className="text-sm text-gray-600">
                Registra trabajos y asigna destajistas a cada lote
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <span className="text-white text-2xl">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Consulta el Resumen
              </h4>
              <p className="text-sm text-gray-600">
                Visualiza consolidados y totales por destajista
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
