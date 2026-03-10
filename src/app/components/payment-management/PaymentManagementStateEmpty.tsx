/**
 * PAYMENT MANAGEMENT - Estado Empty
 * Muestra la estructura completa de gestión de pagos pero sin datos
 */

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Upload,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Search,
} from "lucide-react";

export function PaymentManagementStateEmpty() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gestión de Pagos</h1>
            <p className="text-muted-foreground">
              Control de pagos, facturas y seguimiento de órdenes de compra
            </p>
          </div>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700 gap-2" disabled>
          <Upload className="h-4 w-4" />
          Importar CSV Bancario
        </Button>
      </div>

      {/* Stats Cards - Empty */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total OCs", value: 0, color: "text-gray-900", icon: FileText, bg: "bg-blue-100", iconColor: "text-blue-600" },
          { label: "Pagadas", value: 0, color: "text-green-600", icon: CheckCircle, bg: "bg-green-100", iconColor: "text-green-600" },
          { label: "Parciales", value: 0, color: "text-orange-600", icon: Clock, bg: "bg-orange-100", iconColor: "text-orange-600" },
          { label: "Pendientes", value: 0, color: "text-yellow-600", icon: Clock, bg: "bg-yellow-100", iconColor: "text-yellow-600" },
          { label: "Vencidos", value: 0, color: "text-red-600", icon: AlertCircle, bg: "bg-red-100", iconColor: "text-red-600" },
          { label: "Sin Factura", value: 0, color: "text-purple-600", icon: FileText, bg: "bg-purple-100", iconColor: "text-purple-600" },
        ].map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-2 ${stat.bg} rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Amount Summary - Empty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Monto Total en OCs
                </p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Monto Pagado
                </p>
                <p className="text-2xl font-bold text-green-600">$0.00</p>
                <p className="text-xs text-muted-foreground mt-1">
                  0.0% del total
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Disabled */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por folio, proveedor o obra..."
                  className="pl-10"
                  disabled
                />
              </div>
            </div>
            <Select disabled>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los estados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table - Empty */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Compra - Estado de Pagos y Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 bg-gray-50">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 w-20">
                    Fecha OC
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">
                    Folio OC
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600">
                    Proveedor
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600">
                    Factura
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 w-24">
                    Fecha Fact.
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">
                    Importe
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600">
                    Pagado
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 w-24">
                    Crédito
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 w-20">
                    Estado
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 w-32">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Receipt className="h-10 w-10 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No hay pagos pendientes
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm mx-auto">
                        No se han encontrado órdenes de compra pendientes de pago o facturación.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
