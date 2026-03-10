import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Users, ArrowLeft, CheckSquare, Square } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface WeeklyExpense {
  week: string;
  purchaseOrders: number;
  payroll: number;
  total: number;
  indirectCost?: number;
}

interface WeeklyExpensesDetailProps {
  expenses: WeeklyExpense[];
  onBack: () => void;
}

// Datos de ejemplo de OCs pagadas por semana
const weeklyPurchaseOrders = {
  "Semana 1": [
    { code: "227-A01JD-CEMEX", supplier: "CEMEX", amount: 45000, paymentDate: "15 Ene 2026" },
    { code: "227-B02JD-FERREMAX", supplier: "FERREMAX", amount: 38000, paymentDate: "16 Ene 2026" },
    { code: "227-C03JD-ACEROS", supplier: "ACEROS DEL NORTE", amount: 42000, paymentDate: "17 Ene 2026" },
  ],
  "Semana 2": [
    { code: "227-D04JD-CEMEX", supplier: "CEMEX", amount: 52000, paymentDate: "22 Ene 2026" },
    { code: "227-E05JD-ELECTRICSA", supplier: "ELECTRICSA", amount: 48000, paymentDate: "23 Ene 2026" },
    { code: "227-F06JD-PLOMERIA", supplier: "PLOMERIA INDUSTRIAL", amount: 38000, paymentDate: "24 Ene 2026" },
    { code: "227-G07JD-PINTURAMA", supplier: "PINTURAMA", amount: 42000, paymentDate: "25 Ene 2026" },
  ],
  "Semana 3": [
    { code: "227-H08JD-CEMEX", supplier: "CEMEX", amount: 35000, paymentDate: "29 Ene 2026" },
    { code: "227-I09JD-FERREMAX", supplier: "FERREMAX", amount: 32000, paymentDate: "30 Ene 2026" },
    { code: "227-J10JD-ACEROS", supplier: "ACEROS DEL NORTE", amount: 28000, paymentDate: "31 Ene 2026" },
  ],
  "Semana 4": [
    { code: "227-K11JD-CEMEX", supplier: "CEMEX", amount: 68000, paymentDate: "05 Feb 2026" },
    { code: "227-L12JD-ELECTRICSA", supplier: "ELECTRICSA", amount: 58000, paymentDate: "06 Feb 2026" },
    { code: "227-M13JD-PLOMERIA", supplier: "PLOMERIA INDUSTRIAL", amount: 48000, paymentDate: "07 Feb 2026" },
    { code: "227-N14JD-PINTURAMA", supplier: "PINTURAMA", amount: 46000, paymentDate: "08 Feb 2026" },
  ],
  "Semana 5": [
    { code: "227-O15JD-CEMEX", supplier: "CEMEX", amount: 52000, paymentDate: "12 Feb 2026" },
    { code: "227-P16JD-FERREMAX", supplier: "FERREMAX", amount: 48000, paymentDate: "13 Feb 2026" },
    { code: "227-Q17JD-ACEROS", supplier: "ACEROS DEL NORTE", amount: 45000, paymentDate: "14 Feb 2026" },
  ],
  "Semana 6": [
    { code: "227-R18JD-CEMEX", supplier: "CEMEX", amount: 72000, paymentDate: "19 Feb 2026" },
    { code: "227-S19JD-ELECTRICSA", supplier: "ELECTRICSA", amount: 58000, paymentDate: "20 Feb 2026" },
    { code: "227-T20JD-PLOMERIA", supplier: "PLOMERIA INDUSTRIAL", amount: 38000, paymentDate: "21 Feb 2026" },
    { code: "227-U21JD-PINTURAMA", supplier: "PINTURAMA", amount: 30000, paymentDate: "22 Feb 2026" },
  ],
  "Semana 7": [
    { code: "227-V22JD-CEMEX", supplier: "CEMEX", amount: 65000, paymentDate: "26 Feb 2026" },
    { code: "227-W23JD-FERREMAX", supplier: "FERREMAX", amount: 58000, paymentDate: "27 Feb 2026" },
    { code: "227-X24JD-ACEROS", supplier: "ACEROS DEL NORTE", amount: 52000, paymentDate: "28 Feb 2026" },
  ],
  "Semana 8": [
    { code: "227-Y25JD-CEMEX", supplier: "CEMEX", amount: 78000, paymentDate: "05 Mar 2026" },
    { code: "227-Z26JD-ELECTRICSA", supplier: "ELECTRICSA", amount: 62000, paymentDate: "06 Mar 2026" },
    { code: "227-A27JD-PLOMERIA", supplier: "PLOMERIA INDUSTRIAL", amount: 42000, paymentDate: "07 Mar 2026" },
    { code: "227-B28JD-PINTURAMA", supplier: "PINTURAMA", amount: 28000, paymentDate: "08 Mar 2026" },
  ],
};

// Datos de ejemplo de destajos por semana
const weeklyDestajos = {
  "Semana 1": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 25000 },
    { initials: "PL", name: "PEDRO LOPEZ", amount: 32000 },
    { initials: "CR", name: "CARLOS RODRIGUEZ", amount: 28000 },
  ],
  "Semana 2": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 28000 },
    { initials: "PL", name: "PEDRO LOPEZ", amount: 30000 },
    { initials: "MG", name: "MIGUEL GOMEZ", amount: 27000 },
  ],
  "Semana 3": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 30000 },
    { initials: "CR", name: "CARLOS RODRIGUEZ", amount: 28000 },
    { initials: "MG", name: "MIGUEL GOMEZ", amount: 27000 },
  ],
  "Semana 4": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 32000 },
    { initials: "PL", name: "PEDRO LOPEZ", amount: 30000 },
    { initials: "CR", name: "CARLOS RODRIGUEZ", amount: 28000 },
  ],
  "Semana 5": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 30000 },
    { initials: "PL", name: "PEDRO LOPEZ", amount: 32000 },
    { initials: "MG", name: "MIGUEL GOMEZ", amount: 28000 },
  ],
  "Semana 6": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 32000 },
    { initials: "CR", name: "CARLOS RODRIGUEZ", amount: 30000 },
    { initials: "MG", name: "MIGUEL GOMEZ", amount: 28000 },
  ],
  "Semana 7": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 33000 },
    { initials: "PL", name: "PEDRO LOPEZ", amount: 32000 },
    { initials: "CR", name: "CARLOS RODRIGUEZ", amount: 30000 },
  ],
  "Semana 8": [
    { initials: "JM", name: "JUAN MARTINEZ", amount: 35000 },
    { initials: "PL", name: "PEDRO LOPEZ", amount: 32000 },
    { initials: "MG", name: "MIGUEL GOMEZ", amount: 28000 },
  ],
};

export function WeeklyExpensesDetail({ expenses, onBack }: WeeklyExpensesDetailProps) {
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleWeek = (week: string) => {
    setSelectedWeeks(prev => {
      if (prev.includes(week)) {
        return prev.filter(w => w !== week);
      } else {
        return [...prev, week];
      }
    });
  };

  const selectedWeeksData = expenses.filter(e => selectedWeeks.includes(e.week));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Desglose Detallado de Gastos</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Selecciona una o varias semanas para ver el detalle y comparar
              </p>
            </div>
          </div>
          
          {selectedWeeks.length > 0 && (
            <Badge variant="default" className="text-lg px-4 py-2">
              {selectedWeeks.length} semana{selectedWeeks.length !== 1 ? 's' : ''} seleccionada{selectedWeeks.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Week Selector */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600" />
              Seleccionar Semanas
            </CardTitle>
            <CardDescription>
              Marca las semanas que deseas analizar. Puedes seleccionar varias para comparar.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {expenses.map((expense) => (
                <div
                  key={expense.week}
                  onClick={() => toggleWeek(expense.week)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedWeeks.includes(expense.week)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={selectedWeeks.includes(expense.week)}
                      onCheckedChange={() => toggleWeek(expense.week)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{expense.week}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(expense.purchaseOrders + expense.payroll)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Weeks Detail */}
        {selectedWeeks.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <CheckSquare className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Selecciona al menos una semana
              </h3>
              <p className="text-sm text-muted-foreground">
                Marca las semanas arriba para ver el desglose detallado de órdenes de compra y destajos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${selectedWeeks.length === 1 ? 'grid-cols-1' : selectedWeeks.length === 2 ? 'grid-cols-2' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {selectedWeeksData.map((weekData) => {
              const weekPOs = weeklyPurchaseOrders[weekData.week as keyof typeof weeklyPurchaseOrders] || [];
              const weekDestajos = weeklyDestajos[weekData.week as keyof typeof weeklyDestajos] || [];

              return (
                <Card key={weekData.week} className="border-2 border-blue-300 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-100 to-slate-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Badge className="text-base bg-blue-600">
                          {weekData.week}
                        </Badge>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWeek(weekData.week)}
                        className="hover:bg-red-100 text-red-600"
                      >
                        Quitar
                      </Button>
                    </div>
                    <CardDescription className="mt-2">
                      Desglose completo de gastos directos
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    {/* Purchase Orders */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ShoppingCart className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Órdenes de Compra Pagadas</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(weekData.purchaseOrders)}
                          </p>
                        </div>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-blue-50 border-b">
                              <th className="text-left p-2 font-semibold">Código OC</th>
                              <th className="text-left p-2 font-semibold">Proveedor</th>
                              <th className="text-right p-2 font-semibold">Monto</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {weekPOs.map((po, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-2">
                                  <Badge variant="outline" className="font-mono text-[10px]">
                                    {po.code}
                                  </Badge>
                                </td>
                                <td className="p-2 text-gray-700">{po.supplier}</td>
                                <td className="text-right p-2 font-semibold text-blue-700">
                                  {formatCurrency(po.amount)}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-blue-100 font-bold">
                              <td colSpan={2} className="p-2 text-xs">SUBTOTAL OCs</td>
                              <td className="text-right p-2 text-blue-900 text-xs">
                                {formatCurrency(weekData.purchaseOrders)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Destajos */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Destajos Pagados</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(weekData.payroll)}
                          </p>
                        </div>
                      </div>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-green-50 border-b">
                              <th className="text-left p-2 font-semibold">Iniciales</th>
                              <th className="text-left p-2 font-semibold">Nombre</th>
                              <th className="text-right p-2 font-semibold">Importe</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {weekDestajos.map((destajo, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-2">
                                  <Badge className="bg-green-600 font-mono text-[10px]">
                                    {destajo.initials}
                                  </Badge>
                                </td>
                                <td className="p-2 text-gray-700 font-medium">{destajo.name}</td>
                                <td className="text-right p-2 font-semibold text-green-700">
                                  {formatCurrency(destajo.amount)}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-green-100 font-bold">
                              <td colSpan={2} className="p-2 text-xs">SUBTOTAL DESTAJOS</td>
                              <td className="text-right p-2 text-green-900 text-xs">
                                {formatCurrency(weekData.payroll)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg border-2 border-slate-300">
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">OCs</p>
                          <p className="text-sm font-bold text-blue-700">
                            {formatCurrency(weekData.purchaseOrders)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Destajos</p>
                          <p className="text-sm font-bold text-green-700">
                            {formatCurrency(weekData.payroll)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Indirecto</p>
                          <p className="text-sm font-bold text-orange-700">
                            {formatCurrency(weekData.indirectCost || 0)}
                          </p>
                        </div>
                        <div className="bg-slate-200 rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground mb-1">TOTAL</p>
                          <p className="text-base font-bold text-gray-900">
                            {formatCurrency(
                              weekData.purchaseOrders + 
                              weekData.payroll + 
                              (weekData.indirectCost || 0)
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
