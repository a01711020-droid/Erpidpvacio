import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ShoppingCart, Users, AlertCircle, TrendingUp, Eye } from "lucide-react";
import { Button } from "./ui/button";

interface WeeklyExpense {
  week: string;
  purchaseOrders: number;
  payroll: number;
  total: number;
  indirectCost?: number;
}

interface WeeklyExpensesProps {
  expenses: WeeklyExpense[];
  onViewDetail?: () => void;
}

export function WeeklyExpenses({ expenses, onViewDetail }: WeeklyExpensesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { 
      style: 'currency', 
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalPurchaseOrders = expenses.reduce((sum, e) => sum + e.purchaseOrders, 0);
  const totalPayroll = expenses.reduce((sum, e) => sum + e.payroll, 0);
  const totalIndirect = expenses.reduce((sum, e) => sum + (e.indirectCost || 0), 0);
  const totalExpenses = totalPurchaseOrders + totalPayroll;
  const totalWithIndirect = totalExpenses + totalIndirect;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Órdenes de Compra</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPurchaseOrders)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Destajos</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalPayroll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Salidas</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Costos Indirectos</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalIndirect)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total con Indirectos</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalWithIndirect)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Weekly Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detalle de Gastos Semanales con Costos Indirectos</CardTitle>
              <CardDescription className="mt-2">
                Vista detallada incluyendo la distribución proporcional de gastos indirectos empresariales
              </CardDescription>
            </div>
            {onViewDetail && (
              <Button
                onClick={onViewDetail}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                size="lg"
              >
                <Eye className="h-5 w-5" />
                Ver Desglose Detallado
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 bg-slate-50">
                  <th className="text-left p-3 font-semibold">Periodo</th>
                  <th className="text-right p-3 font-semibold text-blue-700">Órdenes de Compra</th>
                  <th className="text-right p-3 font-semibold text-green-700">Destajos</th>
                  <th className="text-right p-3 font-semibold text-orange-700">Indirecto Asignado</th>
                  <th className="text-right p-3 font-semibold text-gray-900">Total Real</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenses.map((expense, index) => {
                  const subtotal = expense.purchaseOrders + expense.payroll;
                  const totalWithIndirect = subtotal + (expense.indirectCost || 0);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">{expense.week}</td>
                      <td className="text-right p-3 text-blue-700">
                        {formatCurrency(expense.purchaseOrders)}
                      </td>
                      <td className="text-right p-3 text-green-700">
                        {formatCurrency(expense.payroll)}
                      </td>
                      <td className="text-right p-3 text-orange-700 font-semibold">
                        {formatCurrency(expense.indirectCost || 0)}
                      </td>
                      <td className="text-right p-3 font-bold text-gray-900 bg-slate-50">
                        {formatCurrency(totalWithIndirect)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-200 font-bold border-t-2">
                  <td className="p-3">TOTALES</td>
                  <td className="text-right p-3 text-blue-700">
                    {formatCurrency(totalPurchaseOrders)}
                  </td>
                  <td className="text-right p-3 text-green-700">
                    {formatCurrency(totalPayroll)}
                  </td>
                  <td className="text-right p-3 text-orange-700">
                    {formatCurrency(totalIndirect)}
                  </td>
                  <td className="text-right p-3 text-gray-900 bg-slate-300">
                    {formatCurrency(totalWithIndirect)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-900">
              <strong>Nota:</strong> Los costos indirectos se distribuyen proporcionalmente según los gastos directos de cada semana. 
              El cálculo considera la participación de esta obra en el total de gastos empresariales.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
