/**
 * PERSONAL MANAGEMENT - Estado Empty
 * Muestra la estructura completa de gestión de personal pero sin datos
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { ArrowLeft, UserCog, UserPlus, Users, Calendar, Search } from "lucide-react";

interface Props {
  onBack?: () => void;
  onAdd?: () => void;
}

export default function PersonalStateEmpty({ onBack, onAdd }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 border-b border-gray-800 shadow-lg">
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
                <UserCog className="h-10 w-10 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Gestión de Personal
                  </h1>
                  <p className="text-gray-200 text-sm">
                    Control y administración de nómina
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={onAdd}
              className="gap-2 bg-white text-gray-800 hover:bg-gray-100"
            >
              <UserPlus className="h-5 w-5" />
              Nuevo Empleado
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs defaultValue="consolidado" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200">
            <TabsTrigger value="consolidado" className="gap-2">
              <Calendar className="h-4 w-4" />
              Consolidado de Nómina
            </TabsTrigger>
            <TabsTrigger value="employees" className="gap-2">
              <Users className="h-4 w-4" />
              Administración de Personal
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CONSOLIDADO DE NÓMINA (Empty) */}
          <TabsContent value="consolidado" className="space-y-6">
            <Card className="border-gray-300 bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Consolidado Total
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 font-medium">
                      Año 2026
                    </p>
                    <p className="text-xs text-gray-500">
                      0 Destajistas + 0 Personal
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Controles de Navegación de Semana */}
                <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="gap-1 bg-white hover:bg-slate-100"
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-2">
                      <Select disabled>
                        <SelectTrigger className="w-[140px] bg-white">
                          <SelectValue placeholder="Semana 1" />
                        </SelectTrigger>
                        <SelectContent />
                      </Select>
                      <Select disabled>
                        <SelectTrigger className="w-[110px] bg-white">
                          <SelectValue placeholder="2026" />
                        </SelectTrigger>
                        <SelectContent />
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="gap-1 bg-white hover:bg-slate-100"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg bg-white border-gray-300 p-12 text-center">
                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-medium text-gray-900 mb-2">
                     Sin Registros de Nómina
                   </h3>
                   <p className="text-gray-500 max-w-sm mx-auto">
                     No hay datos de nómina para mostrar. Registre empleados y destajos para ver el consolidado.
                   </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: ADMINISTRACIÓN DE PERSONAL (Empty) */}
          <TabsContent value="employees" className="space-y-6">
             <Card className="border-gray-300 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar empleado..."
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <Select disabled>
                    <SelectTrigger className="w-full md:w-[250px]">
                      <SelectValue placeholder="Todas las Obras" />
                    </SelectTrigger>
                    <SelectContent />
                  </Select>
                </div>

                 <div className="border rounded-lg bg-white border-gray-300 p-12 text-center">
                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                   </div>
                   <h3 className="text-lg font-medium text-gray-900 mb-2">
                     No hay empleados registrados
                   </h3>
                   <p className="text-gray-500 max-w-sm mx-auto mb-6">
                     Comience agregando el primer empleado al sistema.
                   </p>
                   <Button onClick={onAdd} className="bg-gray-800 hover:bg-gray-900 text-white">
                     <UserPlus className="h-4 w-4 mr-2" />
                     Agregar Primer Empleado
                   </Button>
                </div>
              </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
