/**
 * GLOBAL DASHBOARD - Estado Data
 * Muestra el dashboard completo con todas las obras
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  ShoppingCart,
  Users,
  Calendar,
  MapPin,
  Plus,
  ArrowRight,
  Archive,
  BarChart3,
} from "lucide-react";
import { obrasDashboardMock } from "/spec/dashboard/obras.mock";

// DATOS MOCK COMPLETOS - 6 obras reales (importado desde spec)
const mockWorks = obrasDashboardMock;

interface DashboardStateDataProps {
  onSelectProject?: (projectId: string) => void;
  onCreateWork?: () => void;
}

export function DashboardStateData({
  onSelectProject,
  onCreateWork,
}: DashboardStateDataProps) {
  const activeWorks = mockWorks;
  const totalContracts = activeWorks.reduce(
    (sum, w) => sum + w.contractAmount,
    0
  );
  const totalBalance = activeWorks.reduce((sum, w) => sum + w.actualBalance, 0);
  const totalEstimates = activeWorks.reduce(
    (sum, w) => sum + w.totalEstimates,
    0
  );
  const totalExpenses = activeWorks.reduce(
    (sum, w) => sum + w.totalExpenses,
    0
  );

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
          <Button variant="outline" size="sm" className="gap-2">
            <Archive className="h-4 w-4" />
            Ver Archivadas (0)
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Obras Activas
                  </p>
                  <p className="text-3xl font-bold">{activeWorks.length}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-slate-600" />
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
                  <p className="text-3xl font-bold">
                    $
                    {(totalContracts / 1000000).toLocaleString("es-MX", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                    M
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
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
                  <p className="text-3xl font-bold text-green-600">
                    $
                    {(totalBalance / 1000000).toLocaleString("es-MX", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                    M
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
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
                  <p className="text-3xl font-bold">
                    {((totalEstimates / totalContracts) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Works Table */}
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
                  {activeWorks.map((work) => {
                    const progress =
                      (work.totalEstimates / work.contractAmount) * 100;
                    return (
                      <tr key={work.code} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-mono font-semibold">
                            {work.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">{work.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {work.client}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{work.resident}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          $
                          {work.contractAmount.toLocaleString("es-MX", {
                            minimumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-green-600">
                          $
                          {work.actualBalance.toLocaleString("es-MX", {
                            minimumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-300"
                          >
                            {work.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onSelectProject && onSelectProject(work.code)
                              }
                            >
                              Ver
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}