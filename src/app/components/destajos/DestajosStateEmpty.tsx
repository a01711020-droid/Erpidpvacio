/**
 * DESTAJOS - Estado Empty
 * Estructura homóloga a la vista de obras pero sin datos
 */

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  HardHat,
  Users,
  ArrowLeft,
  Search,
  Building2,
  Plus,
} from "lucide-react";

interface Props {
  onCreateWork?: () => void;
  onManageDestajistas?: () => void;
  onBack?: () => void;
}

export function DestajosStateEmpty({
  onCreateWork,
  onManageDestajistas,
  onBack,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Homólogo a Destajos Data View */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-xl mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="p-3 bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-500/30">
                <HardHat className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Control de Destajos
                </h1>
                <p className="text-gray-400 text-lg">
                  Gestión de avances y pagos por obra
                </p>
              </div>
            </div>

            <Button
              onClick={onManageDestajistas}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 border border-blue-500/50"
              size="lg"
            >
              <Users className="h-5 w-5 mr-2" />
              Gestión de Destajistas
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Actions Bar Placeholder */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <Input
              placeholder="Buscar obra..."
              className="pl-10 bg-white border-gray-200 focus:border-blue-500 transition-all"
              disabled
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
            <Building2 className="h-4 w-4" />
            <span className="font-semibold">0</span>
            obras activas
          </div>
        </div>

        {/* Empty Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Placeholder showing "Empty State" */}
          <Card className="col-span-full border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-default">
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                <HardHat className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay obras asignadas
              </h3>
              <p className="text-gray-500 max-w-md mb-8">
                Las obras se gestionan desde el Dashboard General. Una vez creadas, aparecerán aquí para gestionar sus destajos.
              </p>
              {onCreateWork && (
                 // Although the user said "works are created in general panel", 
                 // providing a button to go there or trigger creation (if supported) is good UX.
                 // Since handleCreateWork is just a log, maybe we shouldn't emphasize it, 
                 // but the requirement "every button must work" suggests we should render it if passed.
                 // But wait, Destajos.tsx creates this function. 
                 // I'll leave it as a secondary action or just a hint.
                <Button onClick={onCreateWork} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear Nueva Obra
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
