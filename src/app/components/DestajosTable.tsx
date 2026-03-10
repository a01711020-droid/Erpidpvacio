import { useState } from "react";
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

interface DestajoItem {
  inicial: string;
  destajista: string;
  totalImporte: number;
}

const mockDataBySemana: Record<string, DestajoItem[]> = {
  "2024-S01": [
    { inicial: "CFU", destajista: "Fidel Tinajero", totalImporte: 4200.0 },
    { inicial: "JN", destajista: "Jose Nava", totalImporte: 2000.0 },
    { inicial: "RB", destajista: "Remedios Bautista", totalImporte: 5400.0 },
    { inicial: "SL", destajista: "Severo Luciano", totalImporte: 6450.0 },
  ],
  "2024-S02": [
    { inicial: "CFU", destajista: "Fidel Tinajero", totalImporte: 4500.0 },
    { inicial: "RB", destajista: "Remedios Bautista", totalImporte: 5100.0 },
    { inicial: "SL", destajista: "Severo Luciano", totalImporte: 6200.0 },
    { inicial: "MA", destajista: "Miguel Alvarez", totalImporte: 3800.0 },
  ],
  "2024-S03": [
    { inicial: "CFU", destajista: "Fidel Tinajero", totalImporte: 4800.0 },
    { inicial: "JN", destajista: "Jose Nava", totalImporte: 2500.0 },
    { inicial: "RB", destajista: "Remedios Bautista", totalImporte: 5600.0 },
    { inicial: "SL", destajista: "Severo Luciano", totalImporte: 6800.0 },
    { inicial: "MA", destajista: "Miguel Alvarez", totalImporte: 4100.0 },
  ],
  "2024-S04": [
    { inicial: "CFU", destajista: "Fidel Tinajero", totalImporte: 5000.0 },
    { inicial: "RB", destajista: "Remedios Bautista", totalImporte: 5800.0 },
    { inicial: "SL", destajista: "Severo Luciano", totalImporte: 7000.0 },
  ],
};

export function DestajosTable() {
  const [selectedWeek, setSelectedWeek] = useState<string>("2024-S01");

  const currentData = mockDataBySemana[selectedWeek] || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const totalImporte = currentData.reduce(
    (sum, item) => sum + item.totalImporte,
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Destajos</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Semana</span>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-S01">Semana 1 - 2024</SelectItem>
                <SelectItem value="2024-S02">Semana 2 - 2024</SelectItem>
                <SelectItem value="2024-S03">Semana 3 - 2024</SelectItem>
                <SelectItem value="2024-S04">Semana 4 - 2024</SelectItem>
                <SelectItem value="2024-S05">Semana 5 - 2024</SelectItem>
                <SelectItem value="2024-S06">Semana 6 - 2024</SelectItem>
                <SelectItem value="2024-S07">Semana 7 - 2024</SelectItem>
                <SelectItem value="2024-S08">Semana 8 - 2024</SelectItem>
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
