/**
 * CONTRACT TRACKING - Estado Empty
 * Muestra la estructura completa pero sin datos de movimientos
 */

import { Button } from "@/app/components/ui/button";
import { Plus, HardHat, AlertCircle, TrendingUp } from "lucide-react";
import { ContractHeader } from "@/app/components/ContractHeader";
import { EstimationsTable } from "@/app/components/EstimationsTable";
import { WeeklyExpenses } from "@/app/components/WeeklyExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface ContractTrackingStateEmptyProps {
  onAddMovement?: () => void;
}

export function ContractTrackingStateEmpty({ onAddMovement }: ContractTrackingStateEmptyProps) {
  // Datos vacíos para el contrato
  const emptyContract = {
    contractNumber: "---",
    contractAmount: 0,
    client: "---",
    projectName: "---",
    startDate: "---",
    endDate: "---",
    advancePercentage: 0,
    guaranteeFundPercentage: 0,
  };

  // Datos vacíos para gastos indirectos
  const thisWorkExpenses = 0;
  const totalAllWorksExpenses = 0;
  const proportion = 0;
  const indirectCostsTotal = 0;
  const indirectCostAssigned = 0;
  const totalWithIndirect = 0;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Seguimiento Físico de Contrato
              </h2>
              <p className="text-sm text-gray-500">
                Control de obra y flujo financiero
              </p>
            </div>
          </div>

          {/* Add Movement Button */}
          <Button variant="outline" className="w-full md:w-auto" onClick={onAddMovement}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Movimiento
          </Button>

          {/* Contract Information */}
          <ContractHeader contract={emptyContract} />

          {/* Contract Movements Table (Empty) */}
          <EstimationsTable estimations={[]} />

          {/* Weekly Expenses (Empty) */}
          <WeeklyExpenses expenses={[]} />

          {/* Indirect Costs Card (Empty) */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 opacity-70">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    Gastos Indirectos Asignados a Esta Obra
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Distribución proporcional del indirecto empresarial según el
                    gasto de esta obra
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Gastos Directos de esta obra */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-xs text-muted-foreground mb-1">
                    Gastos Directos (Obra)
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $0
                  </p>
                </div>

                {/* Proporción */}
                <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-xs text-blue-700 mb-1">
                    Proporción del Total
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-blue-900">
                      0.00%
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      de $0
                    </Badge>
                  </div>
                </div>

                {/* Indirecto Asignado */}
                <div className="p-4 bg-orange-100 rounded-lg shadow-sm border border-orange-300">
                  <p className="text-xs text-orange-700 mb-1">
                    Indirecto Asignado
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    $0
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    de $0 total
                  </p>
                </div>

                {/* Total con Indirecto */}
                <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-sm border-2 border-orange-400">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-orange-700" />
                    <p className="text-xs text-orange-700 font-semibold">
                      Total Real con Indirecto
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">
                    $0
                  </p>
                </div>
              </div>

              {/* Explicación del cálculo */}
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  ¿Cómo se calculan los gastos indirectos?
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    <strong>1.</strong> Se suman todos los gastos directos de
                    todas las obras activas.
                  </p>
                  <p>
                    <strong>2.</strong> Se calcula la proporción de esta obra.
                  </p>
                  <p>
                    <strong>3.</strong> Se aplica esa proporción al total de
                    indirectos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
