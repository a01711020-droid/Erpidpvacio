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
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Fragment } from "react";

interface PurchaseOrderItem {
  code: string;
  importe: number;
  montoPago: number;
  balance: number;
}

interface PurchaseOrderGroup {
  proveedor: string;
  items: PurchaseOrderItem[];
  totalImporte: number;
  totalMontoPago: number;
  totalBalance: number;
}

const mockData: Record<string, PurchaseOrderGroup[]> = {
  "2024-01": [
    {
      proveedor: "Cimbras Leon",
      items: [
        {
          code: "232-A12CA-Cimbras Leon",
          importe: 5467.08,
          montoPago: 5467.08,
          balance: 0,
        },
      ],
      totalImporte: 5467.08,
      totalMontoPago: 5467.08,
      totalBalance: 0,
    },
    {
      proveedor: "FERREMATGE6",
      items: [
        {
          code: "232-A02CA-FERREMATGE6",
          importe: 160238.08,
          montoPago: 160238.08,
          balance: 0,
        },
        {
          code: "232-A03CA-FERREMATGE6",
          importe: 2739.82,
          montoPago: 2739.82,
          balance: 0,
        },
      ],
      totalImporte: 216792.74,
      totalMontoPago: 197146.56,
      totalBalance: 16151.94,
    },
  ],
  "2024-02": [
    {
      proveedor: "Materiales del Norte",
      items: [
        {
          code: "232-B01CA-Materiales del Norte",
          importe: 85320.5,
          montoPago: 85320.5,
          balance: 0,
        },
      ],
      totalImporte: 85320.5,
      totalMontoPago: 85320.5,
      totalBalance: 0,
    },
    {
      proveedor: "Aceros Industriales",
      items: [
        {
          code: "232-B02CA-Aceros Industriales",
          importe: 125000.0,
          montoPago: 110000.0,
          balance: 15000.0,
        },
      ],
      totalImporte: 125000.0,
      totalMontoPago: 110000.0,
      totalBalance: 15000.0,
    },
  ],
  "2024-03": [
    {
      proveedor: "Construcciones SA",
      items: [
        {
          code: "232-C01CA-Construcciones SA",
          importe: 195000.0,
          montoPago: 195000.0,
          balance: 0,
        },
      ],
      totalImporte: 195000.0,
      totalMontoPago: 195000.0,
      totalBalance: 0,
    },
  ],
};

export function PurchaseOrdersTable() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024-01");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const currentData = mockData[selectedPeriod] || [];

  const toggleGroup = (proveedor: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(proveedor)) {
      newExpanded.delete(proveedor);
    } else {
      newExpanded.add(proveedor);
    }
    setExpandedGroups(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Órdenes de Compra</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Meses (Fecha)</span>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">Enero 2024</SelectItem>
                <SelectItem value="2024-02">Febrero 2024</SelectItem>
                <SelectItem value="2024-03">Marzo 2024</SelectItem>
                <SelectItem value="2024-04">Abril 2024</SelectItem>
                <SelectItem value="2024-05">Mayo 2024</SelectItem>
                <SelectItem value="2024-06">Junio 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead className="text-right">Suma de Importe_OC</TableHead>
              <TableHead className="text-right">Suma de Monto_Pago</TableHead>
              <TableHead className="text-right">Suma de Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((group) => (
              <Fragment key={group.proveedor}>
                <TableRow
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleGroup(group.proveedor)}
                >
                  <TableCell>
                    {expandedGroups.has(group.proveedor) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {group.proveedor}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(group.totalImporte)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(group.totalMontoPago)}
                  </TableCell>
                  <TableCell className="text-right">
                    {group.totalBalance === 0
                      ? "—"
                      : formatCurrency(group.totalBalance)}
                  </TableCell>
                </TableRow>
                {expandedGroups.has(group.proveedor) &&
                  group.items.map((item) => (
                    <TableRow key={item.code} className="bg-muted/20">
                      <TableCell></TableCell>
                      <TableCell className="pl-8 text-sm">
                        {item.code}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(item.importe)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(item.montoPago)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {item.balance === 0 ? "—" : formatCurrency(item.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            ))}
            {currentData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay datos disponibles para este período
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}