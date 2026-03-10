import { PurchaseOrdersTable } from "./components/PurchaseOrdersTable";
import { DestajosTable } from "./components/DestajosTable";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export default function ExpenseDetails() {
  // Datos de gastos semanales (en producción vendrían del backend)
  const weeklyExpenses = [
    { week: "Semana 1", purchaseOrders: 125000, destajos: 45000, total: 170000 },
    { week: "Semana 2", purchaseOrders: 180000, destajos: 52000, total: 232000 },
    { week: "Semana 3", purchaseOrders: 95000, destajos: 38000, total: 133000 },
    { week: "Semana 4", purchaseOrders: 220000, destajos: 61000, total: 281000 },
    { week: "Semana 5", purchaseOrders: 145000, destajos: 47000, total: 192000 },
    { week: "Semana 6", purchaseOrders: 198000, destajos: 55000, total: 253000 },
    { week: "Semana 7", purchaseOrders: 175000, destajos: 49000, total: 224000 },
    { week: "Semana 8", purchaseOrders: 210000, destajos: 58000, total: 268000 },
  ];

  const totalPurchaseOrders = weeklyExpenses.reduce((sum, week) => sum + week.purchaseOrders, 0);
  const totalDestajos = weeklyExpenses.reduce((sum, week) => sum + week.destajos, 0);
  const totalExpenses = weeklyExpenses.reduce((sum, week) => sum + week.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Detalle de Gastos
          </h1>
          <p className="text-muted-foreground">
            Información detallada de Órdenes de Compra y Destajos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Órdenes de Compra</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ${totalPurchaseOrders.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Destajos</p>
                  <p className="text-2xl font-bold text-purple-700">
                    ${totalDestajos.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total General</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Expenses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Gastos Semanales por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left p-3 font-semibold">Periodo</th>
                    <th className="text-right p-3 font-semibold text-blue-700">Órdenes de Compra</th>
                    <th className="text-right p-3 font-semibold text-purple-700">Destajos</th>
                    <th className="text-right p-3 font-semibold">Total Semanal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {weeklyExpenses.map((expense, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{expense.week}</td>
                      <td className="text-right p-3 text-blue-700">
                        ${expense.purchaseOrders.toLocaleString()}
                      </td>
                      <td className="text-right p-3 text-purple-700">
                        ${expense.destajos.toLocaleString()}
                      </td>
                      <td className="text-right p-3 font-bold">
                        ${expense.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold">
                    <td className="p-3">TOTALES</td>
                    <td className="text-right p-3 text-blue-700">
                      ${totalPurchaseOrders.toLocaleString()}
                    </td>
                    <td className="text-right p-3 text-purple-700">
                      ${totalDestajos.toLocaleString()}
                    </td>
                    <td className="text-right p-3 text-emerald-700">
                      ${totalExpenses.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <PurchaseOrdersTable />

        {/* Destajos Table */}
        <DestajosTable />
      </div>
    </div>
  );
}