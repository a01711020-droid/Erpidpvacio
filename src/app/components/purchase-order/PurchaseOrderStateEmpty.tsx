/**
 * PURCHASE ORDER - Estado Empty
 * Muestra la estructura completa pero sin datos
 */

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  FileText,
  Users,
  ShoppingCart,
  ClipboardList,
  Search,
  Filter,
  Plus,
  ShoppingBag,
} from "lucide-react";

interface PurchaseOrderStateEmptyProps {
  onCreateOrder?: () => void;
  onNavigateToSuppliers?: () => void;
}

export function PurchaseOrderStateEmpty({
  onCreateOrder,
  onNavigateToSuppliers,
}: PurchaseOrderStateEmptyProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-700 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Departamento de Compras
                </h1>
                <p className="text-muted-foreground">
                  Gestión centralizada de órdenes de compra y requisiciones
                </p>
              </div>
            </div>

            {/* Botón visible de Gestión de Proveedores */}
            <Button
              onClick={onNavigateToSuppliers}
              className="gap-2 bg-green-600 hover:bg-green-700 shadow-lg"
              size="lg"
            >
              <Users className="h-5 w-5" />
              Gestión de Proveedores
            </Button>
          </div>
        </div>

        {/* Tabs Placeholder */}
        <div className="mb-6">
          <div className="flex gap-2 border-b bg-white rounded-t-lg">
            <button className="flex items-center gap-2 px-6 py-3 font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50 relative">
              <ShoppingCart className="h-5 w-5" />
              Órdenes de Compra
              <Badge variant="secondary" className="ml-2">
                0
              </Badge>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-400 hover:text-gray-600 relative cursor-not-allowed">
              <ClipboardList className="h-5 w-5" />
              Requisiciones Recibidas
              <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-400">
                0
              </Badge>
            </button>
          </div>
        </div>

        {/* Filters and Actions Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por folio, proveedor u obra..."
                    className="pl-10"
                    disabled
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Select disabled>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Estado: Todos" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select disabled>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Obra: Todas" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                  onClick={onCreateOrder}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto gap-2 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Orden
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty Table Placeholder */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50/50">
                    <th className="px-4 py-3 text-left font-medium text-gray-500 w-[140px]">
                      Folio
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Proveedor
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">
                      Obra / Cliente
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500 w-[120px]">
                      Monto Total
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-[120px]">
                      Entrega
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-[120px]">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-[100px]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-full">
                          <ShoppingBag className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          No hay órdenes de compra
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-4">
                          No se han encontrado órdenes de compra registradas en el sistema.
                          Puedes comenzar creando una nueva orden.
                        </p>
                        <Button 
                          variant="outline" 
                          className="border-dashed border-2 hover:border-solid hover:bg-blue-50 hover:text-blue-600"
                          onClick={onCreateOrder}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Crear Primera Orden
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
