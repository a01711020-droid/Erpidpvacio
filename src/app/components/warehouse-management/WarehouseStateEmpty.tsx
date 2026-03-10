import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { ArrowLeft, Warehouse, Search, Package } from "lucide-react";

interface Props {
  onBack?: () => void;
  onRefresh?: () => void;
}

export default function WarehouseStateEmpty({ onBack, onRefresh }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-800 border-b-4 border-orange-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <Warehouse className="h-10 w-10 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Almacén Central
                  </h1>
                  <p className="text-orange-100">
                    Control de recepción y salida de materiales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por OC o proveedor..."
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>
              <Select disabled>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Filtrar por obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las Obras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-orange-100">
            <TabsTrigger value="orders">Órdenes de Compra</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          {/* TAB 1: ÓRDENES DE COMPRA (Empty) */}
          <TabsContent value="orders">
            <Card className="border-orange-200">
              <CardContent className="p-0">
                {/* Header de tabla de OCs */}
                <div className="grid grid-cols-10 gap-4 p-4 bg-gray-50 border-b font-semibold text-sm text-gray-700">
                  <div className="col-span-3">OC / Fecha</div>
                  <div className="col-span-2">Obra</div>
                  <div className="col-span-2">F. Entrega Esperada</div>
                  <div className="col-span-2 text-center">Tipo</div>
                  <div className="col-span-1 text-right">Acciones</div>
                </div>

                {/* Empty State Row */}
                <div className="p-16 text-center bg-white">
                  <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sin Órdenes Pendientes
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-6">
                    No hay órdenes de compra pendientes de recepción. Las nuevas
                    órdenes aprobadas aparecerán aquí.
                  </p>
                  {onRefresh && (
                    <Button onClick={onRefresh} variant="outline">
                      Actualizar Lista
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
             <Card className="border-orange-200">
              <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <Warehouse className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Inventario Vacío
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    No hay materiales registrados en el inventario actual.
                  </p>
              </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="alerts">
             <Card className="border-orange-200">
              <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Search className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Sin Alertas
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Todo está en orden. No hay materiales pendientes o retrasados.
                  </p>
              </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
