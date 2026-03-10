/**
 * MATERIAL REQUISITIONS - Estado Empty
 * Muestra la vista de requisiciones autenticada pero vacía
 */

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Package, Lock, Plus, FileText } from "lucide-react";

interface MaterialRequisitionsStateEmptyProps {
  onCreateRequisition?: () => void;
}

export function MaterialRequisitionsStateEmpty({
  onCreateRequisition,
}: MaterialRequisitionsStateEmptyProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Package className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Requisiciones</h1>
                <p className="text-sm text-amber-100 mt-1">
                  Residente de Obra
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              disabled
            >
              <Lock className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-amber-200">Obra</p>
              <p className="font-bold text-lg">---</p>
              <p className="text-xs text-amber-100 mt-1">Sin Asignar</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-amber-200">Requisiciones</p>
              <p className="font-bold text-3xl">0</p>
            </div>
          </div>
        </div>

        {/* New Requisition Button - Floating Style */}
        <Button
          onClick={onCreateRequisition}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 py-6 text-lg shadow-lg"
          size="lg"
        >
          <Plus className="h-6 w-6 mr-2" />
          Nueva Requisición
        </Button>

        {/* My Requisitions List - Empty State */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 px-1">
            Mis Requisiciones
          </h2>

          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <FileText className="h-10 w-10 text-amber-700" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                No hay requisiciones
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                No has creado ninguna requisición de material todavía.
              </p>
              <Button
                onClick={onCreateRequisition}
                className="bg-amber-600 hover:bg-amber-700 shadow-sm"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Primera Requisición
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
