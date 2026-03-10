/**
 * Componente de Resumen Semanal de Destajos
 * Muestra consolidado de la semana seleccionada con navegación entre las 52 semanas
 */

import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { ArrowUpDown, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DesatajistaImporte {
  inicial: string;
  nombre: string;
  importe: number;
}

interface ObraResumen {
  nombre: string;
  codigo: string;
  destajistas: DesatajistaImporte[];
}

interface Props {
  obras: ObraResumen[];
  onBack: () => void;
}

// Función para calcular fecha de inicio y fin de semana
const getWeekDates = (weekNumber: number, year: number = 2025) => {
  const firstDay = new Date(year, 0, 1);
  const daysToAdd = (weekNumber - 1) * 7;
  const weekStart = new Date(firstDay.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const month = months[date.getMonth()];
    return `${day} de ${month}`;
  };
  
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
};

export default function ResumenDestajos({ obras, onBack }: Props) {
  const [semanaActual, setSemanaActual] = useState(7); // Semana 7 del 2025
  const [sortField, setSortField] = useState<"inicial" | "nombre" | "importe">("inicial");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Calcular tabla consolidada - sumar importes de todos los destajistas
  const consolidado = obras.reduce((acc, obra) => {
    obra.destajistas.forEach((destajista) => {
      const existing = acc.find((d) => d.inicial === destajista.inicial);
      if (existing) {
        existing.importe += destajista.importe;
      } else {
        acc.push({
          inicial: destajista.inicial,
          nombre: destajista.nombre,
          importe: destajista.importe,
        });
      }
    });
    return acc;
  }, [] as DesatajistaImporte[]);

  // Ordenar tabla consolidada
  const consolidadoOrdenado = [...consolidado].sort((a, b) => {
    let comparison = 0;
    if (sortField === "inicial") {
      comparison = a.inicial.localeCompare(b.inicial);
    } else if (sortField === "nombre") {
      comparison = a.nombre.localeCompare(b.nombre);
    } else {
      comparison = a.importe - b.importe;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: "inicial" | "nombre" | "importe") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  // Calcular estadísticas de la semana
  const totalSemana = consolidadoOrdenado.reduce((sum, d) => sum + d.importe, 0);
  const totalObras = obras.length;
  const totalDestajistas = consolidadoOrdenado.length;

  // Navegación de semanas - SOLO 13 SEMANAS
  const handlePrevWeek = () => {
    if (semanaActual > 1) setSemanaActual(semanaActual - 1);
  };

  const handleNextWeek = () => {
    if (semanaActual < 13) setSemanaActual(semanaActual + 1);
  };

  return (
    <div className="space-y-8">
      {/* Título y Navegación */}
      <div>
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Obras
        </Button>
        
        {/* Header de Semana */}
        <Card className="border-gray-300 bg-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Resumen Semanal - Semana {semanaActual} del 2025
                </h2>
                <p className="text-gray-600 text-lg">
                  {getWeekDates(semanaActual)}
                </p>
              </div>
              
              {/* Navegación de Semanas */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevWeek}
                  disabled={semanaActual === 1}
                  className="h-10 w-10 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Select
                  value={semanaActual.toString()}
                  onValueChange={(value) => setSemanaActual(parseInt(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Array.from({ length: 13 }, (_, i) => i + 1).map((week) => (
                      <SelectItem key={week} value={week.toString()}>
                        Semana {week}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextWeek}
                  disabled={semanaActual === 13}
                  className="h-10 w-10 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Desglose por Obra de la Semana - PRIMERO */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Desglose por Obra - Semana {semanaActual}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obras.map((obra) => {
            const totalObra = obra.destajistas.reduce(
              (sum, d) => sum + d.importe,
              0
            );

            // Extraer solo la parte antes del guion
            const nombreCorto = obra.nombre.split(' - ')[0];

            return (
              <Card
                key={obra.codigo}
                className="overflow-hidden border-2 border-gray-300 hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="p-3 bg-gray-800 text-center">
                  <h4 className="font-bold text-white text-lg">
                    {nombreCorto}
                  </h4>
                  <p className="text-gray-300 text-sm mt-1">{obra.codigo}</p>
                </div>
                <div className="flex-1 overflow-auto -mt-px" style={{ maxHeight: '400px' }}>
                  <Table className="border-t-0">
                    <TableHeader className="sticky top-0 bg-gray-700 z-10">
                      <TableRow>
                        <TableHead className="text-white font-bold text-xs py-2">
                          Inicial
                        </TableHead>
                        <TableHead className="text-white font-bold text-xs py-2">
                          Destajista
                        </TableHead>
                        <TableHead className="text-white font-bold text-xs py-2 text-right">
                          Importe Semana
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {obra.destajistas.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center text-gray-500 py-8"
                          >
                            Sin destajistas en esta semana
                          </TableCell>
                        </TableRow>
                      ) : (
                        obra.destajistas.map((destajista, idx) => (
                          <TableRow
                            key={`${obra.codigo}-${destajista.inicial}`}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <TableCell className="font-bold text-gray-900 text-sm py-2">
                              {destajista.inicial}
                            </TableCell>
                            <TableCell className="text-gray-700 text-sm py-2">
                              {destajista.nombre}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-gray-900 text-sm py-2">
                              {formatCurrency(destajista.importe)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-3 bg-gray-100 border-t-2 border-gray-300 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-bold text-sm">
                      Total Obra (S{semanaActual}):
                    </span>
                    <span className="text-gray-900 font-bold text-lg">
                      {formatCurrency(totalObra)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabla Consolidada de la Semana - SEGUNDO */}
      <Card className="border-gray-300 bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Consolidado Total - Semana {semanaActual}
            </h3>
            <div className="text-sm text-gray-600 font-medium">
              Total Destajistas: {consolidadoOrdenado.length}
            </div>
          </div>
          <div className="border rounded-lg bg-white border-gray-300 overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-800">
                <TableRow>
                  <TableHead
                    className="text-white font-bold cursor-pointer hover:bg-gray-700 transition-colors w-[100px]"
                    onClick={() => handleSort("inicial")}
                  >
                    <div className="flex items-center gap-2">
                      Inicial
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-white font-bold cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort("nombre")}
                  >
                    <div className="flex items-center gap-2">
                      Destajista
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-white font-bold w-[220px]">
                    Clave
                  </TableHead>
                  <TableHead
                    className="text-white font-bold cursor-pointer hover:bg-gray-700 transition-colors text-right w-[180px]"
                    onClick={() => handleSort("importe")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Monto de Pago S{semanaActual}
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consolidadoOrdenado.map((destajista, idx) => {
                  // Generar código de pago: DEST-[INICIALES]-S[SEMANA]-[AÑO_2_DIGITOS]
                  const añoActual = new Date().getFullYear().toString().slice(-2);
                  const codigoPago = `DEST-${destajista.inicial}-S${semanaActual.toString().padStart(2, '0')}-${añoActual}`;
                  
                  return (
                    <TableRow
                      key={destajista.inicial}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className="font-bold text-gray-900">
                        {destajista.inicial}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {destajista.nombre}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-700">
                        {codigoPago}
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 text-right">
                        {formatCurrency(destajista.importe)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-bold text-lg">
                TOTAL SEMANA {semanaActual}:
              </span>
              <span className="text-gray-900 font-bold text-2xl">
                {formatCurrency(totalSemana)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}