/**
 * GLOBAL DASHBOARD - Estado Empty
 * Se muestra cuando no hay obras registradas
 */

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Building2,
  TrendingUp,
  DollarSign,
  BarChart3,
  Plus,
  Archive,
} from "lucide-react";

interface DashboardStateEmptyProps {
  onCreateWork?: () => void;
}

export function DashboardStateEmpty({ onCreateWork }: DashboardStateEmptyProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-700 rounded-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Empresarial
              </h1>
              <p className="text-muted-foreground">
                Gestión financiera global de proyectos constructivos
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Archive className="h-4 w-4" />
            Ver Archivadas (0)
          </Button>
        </div>

        {/* Summary Cards - Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Obras Activas
                  </p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Contratos Totales
                  </p>
                  <p className="text-3xl font-bold text-gray-300">
                    $0.0 M
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Saldo Global
                  </p>
                  <p className="text-3xl font-bold text-gray-300">
                    $0.0 M
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Avance Global
                  </p>
                  <p className="text-3xl font-bold text-gray-300">
                    0%
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-slate-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Works Table Placeholder */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Obras Activas</h2>
              <Button size="sm" className="gap-2" onClick={onCreateWork}>
                <Plus className="h-4 w-4" />
                Nueva Obra
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Nombre de la Obra
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Residente
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                      Contrato
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">
                      Saldo
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Avance
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Empty State Row */}
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-3 bg-slate-50 rounded-full">
                          <Building2 className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-gray-900">No hay obras registradas</p>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                          Comienza registrando tu primera obra para llevar el control financiero y operativo.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-2 border-dashed border-2 hover:border-solid"
                          onClick={onCreateWork}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Registrar Primera Obra
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
