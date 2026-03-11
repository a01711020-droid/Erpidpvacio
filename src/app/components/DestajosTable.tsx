import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { resumenDestajosEndpoint, type DestajoResumenItem } from "@/app/utils/mockApiService";

function formatWeekLabel(weekKey: string): string {
  const [year, week] = weekKey.split("-S");
  if (!year || !week) return weekKey;
  return `Semana ${Number(week)} - ${year}`;
}

export function DestajosTable() {
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [currentData, setCurrentData] = useState<DestajoResumenItem[]>([]);

  useEffect(() => {
    const loadWeeks = async () => {
      const response = await resumenDestajosEndpoint.getAvailableWeeks();
      const weeks = response.data;
      setAvailableWeeks(weeks);
      if (!selectedWeek && weeks.length > 0) {
        setSelectedWeek(weeks[0]);
      }
    };

    void loadWeeks();
  }, [selectedWeek]);

  useEffect(() => {
    if (!selectedWeek) return;

    const loadWeekData = async () => {
      const response = await resumenDestajosEndpoint.getByWeek(selectedWeek);
      setCurrentData(response.data);
    };

    void loadWeekData();
  }, [selectedWeek]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const totalImporte = useMemo(() => {
    return currentData.reduce((sum, item) => sum + item.totalImporte, 0);
  }, [currentData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Destajos</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Semana</span>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona semana" />
              </SelectTrigger>
              <SelectContent>
                {availableWeeks.map((weekKey) => (
                  <SelectItem key={weekKey} value={weekKey}>
                    {formatWeekLabel(weekKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="text-white">Inicial</TableHead>
              <TableHead className="text-white">Destajista</TableHead>
              <TableHead className="text-right text-white">
                Total Importe
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((item, index) => (
              <TableRow
                key={`${item.inicial}-${index}`}
                className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}
              >
                <TableCell className="font-medium">{item.inicial}</TableCell>
                <TableCell>{item.destajista}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.totalImporte)}
                </TableCell>
              </TableRow>
            ))}
            {currentData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  No hay datos disponibles para esta semana
                </TableCell>
              </TableRow>
            )}
            {currentData.length > 0 && (
              <TableRow className="bg-blue-100 font-semibold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(totalImporte)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
