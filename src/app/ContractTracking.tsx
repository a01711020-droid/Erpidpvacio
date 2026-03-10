import { ContractHeader } from "./components/ContractHeader";
import { EstimationsTable } from "./components/EstimationsTable";
import { WeeklyExpenses } from "./components/WeeklyExpenses";
import { WeeklyExpensesDetail } from "./components/WeeklyExpensesDetail";
import { EstimationForm, EstimationFormData } from "./components/EstimationForm";
import { ViewState } from "@/app/components/states";
import {
  ContractTrackingStateLoading,
  ContractTrackingStateError,
  ContractTrackingStateEmpty,
} from "@/app/components/contract-tracking";
import { HardHat, AlertCircle, TrendingUp, Plus, FileText, BarChart3, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { useState } from "react";

interface ContractTrackingProps {
  projectId: string | null;
  initialState?: ViewState;
}

export default function ContractTracking({ projectId, initialState = "data" }: ContractTrackingProps) {
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showEstimationForm, setShowEstimationForm] = useState(false);
  
  // ====================================================================
  // MOCK DATA - Movimientos del Contrato
  // ====================================================================
  // IMPORTANTE: En producción, estos cálculos se deben hacer así:
  // 
  // 1. ANTICIPO INICIAL:
  //    advanceBalance inicial = contractAmount * (advancePercentage / 100)
  //    contractPending inicial = contractAmount
  //    contractAmountCurrent = contractAmount (se actualiza con aditivas/deductivas)
  // 
  // 2. ESTIMACIONES:
  //    - NUEVA FÓRMULA DE AMORTIZACIÓN PROPORCIONAL:
  //      advanceAmortization = (Monto estimación / Contrato vigente actual) × Anticipo total
  //      advanceAmortization = MIN(calculado, advanceBalance disponible)
  //    
  //    - guaranteeFund = MIN(importe × guaranteeFundPercentage/100, CAP_TOTAL - acumulado)
  //    - guaranteeFundCAP = contractAmount × guaranteeFundPercentage/100 ($30,000 para $1M al 3%)
  //    - Neto = importe - advanceAmortization - guaranteeFund
  //    - balanceToPay = Neto - paid
  //    - advanceBalance = advanceBalance anterior - advanceAmortization
  //    - contractPending = contractPending anterior - importe
  //    - contractAmountCurrent NO cambia (solo cambia con aditivas/deductivas)
  // 
  // 3. ADITIVAS:
  //    - NO tienen advanceAmortization ni guaranteeFund
  //    - contractPending = contractPending anterior + importe (SUMA)
  //    - contractAmountCurrent = contractAmountCurrent anterior + importe (ACTUALIZA BASE)
  //    - advanceBalance se mantiene igual
  // 
  // 4. DEDUCTIVAS:
  //    - NO tienen advanceAmortization ni guaranteeFund
  //    - contractPending = contractPending anterior - |importe| (RESTA)
  //    - contractAmountCurrent = contractAmountCurrent anterior - |importe| (ACTUALIZA BASE)
  //    - advanceBalance se mantiene igual
  // ====================================================================
  const [contractMovements, setContractMovements] = useState([
    {
      no: 1,
      type: "estimacion" as const,
      date: "15 Oct 2025",
      description: "Estimación 1 - Trabajos preliminares y cimentación",
      amount: 150000,
      advanceAmortization: 15000, // (150k / 1M) × 100k = 15k
      guaranteeFund: 4500, // 150k × 3% = 4.5k (Acumulado: 4.5k)
      advanceBalance: 85000, // 100k - 15k = 85k
      paid: 130500, // 150k - 15k - 4.5k = 130.5k
      balanceToPay: 0,
      contractPending: 850000, // 1M - 150k = 850k
      contractAmountCurrent: 1000000, // Base inicial
    },
    {
      no: 2,
      type: "estimacion" as const,
      date: "15 Nov 2025",
      description: "Estimación 2 - Estructura y muros",
      amount: 180000,
      advanceAmortization: 18000, // (180k / 1M) × 100k = 18k
      guaranteeFund: 5400, // 180k × 3% = 5.4k (Acumulado: 9.9k)
      advanceBalance: 67000, // 85k - 18k = 67k
      paid: 156600, // 180k - 18k - 5.4k = 156.6k
      balanceToPay: 0,
      contractPending: 670000, // 850k - 180k = 670k
      contractAmountCurrent: 1000000, // Base sin cambios
    },
    {
      no: 3,
      type: "estimacion" as const,
      date: "15 Dic 2025",
      description: "Estimación 3 - Instalaciones hidráulicas y sanitarias",
      amount: 200000,
      advanceAmortization: 20000, // (200k / 1M) × 100k = 20k
      guaranteeFund: 6000, // 200k × 3% = 6k (Acumulado: 15.9k)
      advanceBalance: 47000, // 67k - 20k = 47k
      paid: 174000, // 200k - 20k - 6k = 174k
      balanceToPay: 0,
      contractPending: 470000, // 670k - 200k = 470k
      contractAmountCurrent: 1000000, // Base sin cambios
    },
    {
      no: 4,
      type: "aditiva" as const,
      date: "20 Dic 2025",
      description: "Aditiva 1 - Ampliación de áreas verdes y estacionamiento",
      amount: 150000,
      advanceAmortization: 0, // Aditivas NO amortizan anticipo
      guaranteeFund: 0, // Aditivas NO retienen fondo de garantía
      advanceBalance: 47000, // Se mantiene igual
      paid: 0,
      balanceToPay: 0,
      contractPending: 620000, // 470k + 150k = 620k (SUMA porque es aditiva)
      contractAmountCurrent: 1150000, // ← BASE ACTUALIZADA: 1M + 150k = 1.15M
    },
    {
      no: 5,
      type: "estimacion" as const,
      date: "15 Ene 2026",
      description: "Estimación 4 - Instalaciones eléctricas",
      amount: 220000,
      advanceAmortization: 19130, // (220k / 1.15M) × 100k ≈ 19,130 ← Base cambió por aditiva
      guaranteeFund: 6600, // 220k × 3% = 6.6k (Acumulado: 22.5k)
      advanceBalance: 27870, // 47k - 19,130 = 27,870
      paid: 194270, // 220k - 19,130 - 6.6k = 194,270
      balanceToPay: 0,
      contractPending: 400000, // 620k - 220k = 400k
      contractAmountCurrent: 1150000, // Base vigente: 1.15M
    },
    {
      no: 6,
      type: "estimacion" as const,
      date: "15 Feb 2026",
      description: "Estimación 5 - Acabados generales",
      amount: 150000,
      advanceAmortization: 13043, // (150k / 1.15M) × 100k ≈ 13,043
      guaranteeFund: 4500, // 150k × 3% = 4.5k (Acumulado: 27k)
      advanceBalance: 14827, // 27,870 - 13,043 = 14,827
      paid: 132457, // 150k - 13,043 - 4.5k = 132,457
      balanceToPay: 0,
      contractPending: 250000, // 400k - 150k = 250k
      contractAmountCurrent: 1150000, // Base vigente: 1.15M
    },
    {
      no: 7,
      type: "estimacion" as const,
      date: "15 Mar 2026",
      description: "Estimación 6 - Instalaciones especiales y señalética",
      amount: 150000,
      advanceAmortization: 13043, // (150k / 1.15M) × 100k ≈ 13,043
      guaranteeFund: 3000, // MIN(150k × 3% = 4.5k, CAP restante = 3k) = 3k ← CAP!
      advanceBalance: 1784, // 14,827 - 13,043 = 1,784
      paid: 133957, // 150k - 13,043 - 3k = 133,957
      balanceToPay: 0,
      contractPending: 100000, // 250k - 150k = 100k
      contractAmountCurrent: 1150000, // Base vigente: 1.15M
    },
    {
      no: 8,
      type: "estimacion" as const,
      date: "10 Jun 2026",
      description: "Estimación 7 - Finiquito de obra (100% COMPLETADO)",
      amount: 100000,
      advanceAmortization: 1784, // MIN((100k/1.15M)×100k = 8,695, disponible = 1,784) = 1,784
      guaranteeFund: 0, // MIN(100k × 3% = 3k, CAP restante = 0) = 0 ← CAP ALCANZADO
      advanceBalance: 0, // 1,784 - 1,784 = 0 ← ¡ANTICIPO TOTALMENTE AMORTIZADO!
      paid: 98216, // 100k - 1,784 - 0 = 98,216
      balanceToPay: 0,
      contractPending: 0, // 100k - 100k = 0 ← ¡CONTRATO COMPLETADO 100%!
      contractAmountCurrent: 1150000, // Base vigente: 1.15M
    },
  ]);
  
  // Datos del contrato
  const contractInfo = {
    contractNumber: "CONT-2025-078",
    contractAmount: 1000000, // $1,000,000
    client: "Gobierno del Estado de México",
    projectName: "Construcción de Centro Educativo Nivel Secundaria",
    startDate: "15 Sep 2025",
    endDate: "15 Jun 2026",
    advancePercentage: 10, // 10%
    guaranteeFundPercentage: 3, // 3% CAPEADO a $30,000
  };

  // Datos de salidas semanales
  const weeklyExpenses = [
    { week: "Semana 1", purchaseOrders: 125000, payroll: 85000, total: 210000 },
    { week: "Semana 2", purchaseOrders: 180000, payroll: 85000, total: 265000 },
    { week: "Semana 3", purchaseOrders: 95000, payroll: 85000, total: 180000 },
    { week: "Semana 4", purchaseOrders: 220000, payroll: 90000, total: 310000 },
    { week: "Semana 5", purchaseOrders: 145000, payroll: 90000, total: 235000 },
    { week: "Semana 6", purchaseOrders: 198000, payroll: 90000, total: 288000 },
    { week: "Semana 7", purchaseOrders: 175000, payroll: 95000, total: 270000 },
    { week: "Semana 8", purchaseOrders: 210000, payroll: 95000, total: 305000 },
  ];

  // CÁLCULO DE GASTOS INDIRECTOS PROPORCIONALES
  // Gastos totales de esta obra
  const thisWorkExpenses = weeklyExpenses.reduce((sum, week) => sum + week.total, 0);
  
  // Datos de ejemplo de gastos totales de todas las obras (en producción vendría del backend)
  const totalAllWorksExpenses = 2465000; // Total de gastos de todas las obras activas
  const indirectCostsTotal = 85000; // Monto fijo mensual de indirectos
  
  // Calcular proporción y indirectos asignados a esta obra
  const proportion = totalAllWorksExpenses > 0 ? (thisWorkExpenses / totalAllWorksExpenses) * 100 : 0;
  const indirectCostAssigned = totalAllWorksExpenses > 0 ? (thisWorkExpenses / totalAllWorksExpenses) * indirectCostsTotal : 0;
  const totalWithIndirect = thisWorkExpenses + indirectCostAssigned;

  // Agregar costos indirectos semanales proporcionalmente
  const weeklyExpensesWithIndirect = weeklyExpenses.map(week => {
    const weekProportion = thisWorkExpenses > 0 ? week.total / thisWorkExpenses : 0;
    const weekIndirectCost = weekProportion * indirectCostAssigned;
    return {
      ...week,
      indirectCost: weekIndirectCost,
    };
  });

  const handleSaveEstimation = (data: EstimationFormData) => {
    const lastMovement = contractMovements[contractMovements.length - 1];
    
    // If no movements yet, use base contract values
    const initialAdvanceBalance = contractInfo.contractAmount * (contractInfo.advancePercentage / 100);
    
    // Calcular los valores según el tipo de movimiento
    let newAdvanceBalance = lastMovement?.advanceBalance ?? initialAdvanceBalance;
    let newContractPending = lastMovement?.contractPending ?? contractInfo.contractAmount;
    let newContractAmountCurrent = lastMovement?.contractAmountCurrent ?? contractInfo.contractAmount;
    
    if (data.type === "aditiva") {
      // Aditiva: SUMA al pendiente, NO afecta anticipo
      newContractPending = lastMovement.contractPending + data.amount;
      newContractAmountCurrent = lastMovement.contractAmountCurrent + data.amount;
    } else if (data.type === "deductiva") {
      // Deductiva: RESTA del pendiente, NO afecta anticipo
      newContractPending = lastMovement.contractPending - Math.abs(data.amount);
      newContractAmountCurrent = lastMovement.contractAmountCurrent - Math.abs(data.amount);
    } else {
      // Estimación: RESTA del pendiente, amortiza anticipo
      newContractPending = lastMovement.contractPending - data.amount;
      newAdvanceBalance = lastMovement.advanceBalance - data.advanceAmortization;
    }
    
    // Crear nuevo movimiento
    const newMovement = {
      no: data.movementNumber,
      type: data.type,
      date: data.date,
      description: data.description,
      amount: data.amount,
      advanceAmortization: data.advanceAmortization,
      guaranteeFund: data.guaranteeFund,
      advanceBalance: newAdvanceBalance,
      paid: 0, // Siempre inicia en 0, se edita después desde la tabla
      balanceToPay: data.balanceToPay,
      contractPending: newContractPending,
      contractAmountCurrent: newContractAmountCurrent,
    };
    
    // Agregar a la lista de movimientos
    setContractMovements([...contractMovements, newMovement]);
    
    console.log("✅ Nuevo movimiento agregado:", newMovement);
  };

  // Handlers placeholder
  const handleCreateContract = () => {
    console.log("Crear nuevo contrato");
  };

  const handleRetry = () => {
    console.log("Reintentar carga");
    setViewState("loading");
    setTimeout(() => setViewState("data"), 1000);
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <ContractTrackingStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <ContractTrackingStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return (
      <>
        <ContractTrackingStateEmpty onAddMovement={() => setShowEstimationForm(true)} />
        {showEstimationForm && (
          <EstimationForm
            isOpen={showEstimationForm}
            onClose={() => setShowEstimationForm(false)}
            onSave={(data) => {
              // In empty state, use contractInfo base values since no movements exist yet
              const initialAdvanceBalance = contractInfo.contractAmount * (contractInfo.advancePercentage / 100);
              const newMovement = {
                no: data.movementNumber,
                type: data.type,
                date: data.date,
                description: data.description,
                amount: data.amount,
                advanceAmortization: data.advanceAmortization,
                guaranteeFund: data.guaranteeFund,
                advanceBalance: initialAdvanceBalance - data.advanceAmortization,
                paid: 0,
                balanceToPay: data.balanceToPay,
                contractPending: contractInfo.contractAmount - (data.type === "estimacion" ? data.amount : 0),
                contractAmountCurrent: contractInfo.contractAmount + (data.type === "aditiva" ? data.amount : data.type === "deductiva" ? -data.amount : 0),
              };
              setContractMovements([newMovement]);
              setShowEstimationForm(false);
              setViewState("data");
            }}
            contractInfo={{
              contractAmount: contractInfo.contractAmount,
              advancePercentage: contractInfo.advancePercentage,
              guaranteeFundPercentage: contractInfo.guaranteeFundPercentage,
            }}
          />
        )}
      </>
    );
  }

  // ESTADO: DATA (contenido completo original)
  return (
    <div className="min-h-screen bg-background">
      {showDetailView ? (
        <WeeklyExpensesDetail 
          expenses={weeklyExpensesWithIndirect} 
          onBack={() => setShowDetailView(false)}
        />
      ) : (
        <>
          {/* Main Content */}
          <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Page Title */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <HardHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Seguimiento Físico de Contrato</h2>
                  <p className="text-sm text-gray-500">Control de obra y flujo financiero</p>
                </div>
              </div>

              {/* Add Movement Button - Ahora ARRIBA del ContractHeader */}
              <Button
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => setShowEstimationForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Movimiento
              </Button>

              {/* Contract Information */}
              <ContractHeader contract={contractInfo} />

              {/* Contract Movements Table (antes Estimations) */}
              <EstimationsTable estimations={contractMovements} />

              {/* Weekly Expenses */}
              <WeeklyExpenses 
                expenses={weeklyExpensesWithIndirect} 
                onViewDetail={() => setShowDetailView(true)}
              />

              {/* Indirect Costs Card */}
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">Gastos Indirectos Asignados a Esta Obra</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Distribución proporcional del indirecto empresarial según el gasto de esta obra
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Gastos Directos de esta obra */}
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <p className="text-xs text-muted-foreground mb-1">Gastos Directos (Obra)</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${thisWorkExpenses.toLocaleString()}
                      </p>
                    </div>

                    {/* Proporción */}
                    <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
                      <p className="text-xs text-blue-700 mb-1">Proporción del Total</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-blue-900">
                          {proportion.toFixed(2)}%
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          de ${totalAllWorksExpenses.toLocaleString()}
                        </Badge>
                      </div>
                    </div>

                    {/* Indirecto Asignado */}
                    <div className="p-4 bg-orange-100 rounded-lg shadow-sm border border-orange-300">
                      <p className="text-xs text-orange-700 mb-1">Indirecto Asignado</p>
                      <p className="text-2xl font-bold text-orange-900">
                        ${Math.round(indirectCostAssigned).toLocaleString()}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        de ${indirectCostsTotal.toLocaleString()} total
                      </p>
                    </div>

                    {/* Total con Indirecto */}
                    <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-sm border-2 border-orange-400">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-orange-700" />
                        <p className="text-xs text-orange-700 font-semibold">Total Real con Indirecto</p>
                      </div>
                      <p className="text-2xl font-bold text-orange-900">
                        ${Math.round(totalWithIndirect).toLocaleString()}
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
                        <strong>1.</strong> Se suman todos los gastos directos de todas las obras activas: <span className="font-mono">${totalAllWorksExpenses.toLocaleString()}</span>
                      </p>
                      <p>
                        <strong>2.</strong> Se calcula la proporción de esta obra: <span className="font-mono">${thisWorkExpenses.toLocaleString()} ÷ ${totalAllWorksExpenses.toLocaleString()} = {proportion.toFixed(2)}%</span>
                      </p>
                      <p>
                        <strong>3.</strong> Se aplica esa proporción al total de indirectos: <span className="font-mono">{proportion.toFixed(2)}% × ${indirectCostsTotal.toLocaleString()} = ${Math.round(indirectCostAssigned).toLocaleString()}</span>
                      </p>
                      <p className="mt-2 pt-2 border-t border-blue-300">
                        <strong>Nota:</strong> Los gastos indirectos incluyen renta de oficina, servicios generales, personal administrativo, 
                        seguros empresariales y otros gastos operativos que no se asignan directamente a una obra.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </>
      )}

      {/* Estimation Form Modal */}
      <EstimationForm
        isOpen={showEstimationForm}
        onClose={() => setShowEstimationForm(false)}
        onSave={handleSaveEstimation}
        contractInfo={contractInfo}
        lastEstimation={contractMovements[contractMovements.length - 1]}
      />
    </div>
  );
}