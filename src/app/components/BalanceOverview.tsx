import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

interface BalanceOverviewProps {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyChange: number;
}

export function BalanceOverview({ currentBalance, totalIncome, totalExpenses, monthlyChange }: BalanceOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  const cards = [
    {
      title: "Balance Actual",
      value: currentBalance,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Ingresos del Mes",
      value: totalIncome,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Egresos del Mes",
      value: totalExpenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Variación Mensual",
      value: monthlyChange,
      icon: Activity,
      color: monthlyChange >= 0 ? "text-green-600" : "text-red-600",
      bgColor: monthlyChange >= 0 ? "bg-green-100" : "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(card.value)}</div>
            {index === 3 && (
              <p className={`text-xs ${card.color} mt-1`}>
                {monthlyChange >= 0 ? '+' : ''}{((monthlyChange / currentBalance) * 100).toFixed(1)}% vs mes anterior
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
