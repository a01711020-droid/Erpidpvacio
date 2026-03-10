// Funciones auxiliares para cálculo de fechas
function calculateDueDate(invoiceDate: string, creditDays: number): string {
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + creditDays);
  return date.toISOString().split("T")[0];
}

function calculateOverdueDays(dueDate: string): number {
  const today = new Date("2026-02-09"); // Fecha actual del sistema
  const due = new Date(dueDate);
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

// Mock data para órdenes de compra con pagos
export const purchaseOrdersPaymentMock = [
  {
    id: "1",
    orderNumber: "230-A01JR-CEMEX",
    workCode: "230",
    workName: "CASTELLO H",
    supplier: "CEMEX",
    orderDate: "2026-01-10",
    totalAmount: 40278,
    paidAmount: 0,
    payments: [],
    invoice: {
      id: "inv1",
      folioFactura: "FACT-2026-001",
      montoFactura: 40278,
      fechaFactura: "2026-01-12",
      diasCredito: 30,
      fechaVencimiento: calculateDueDate("2026-01-12", 30),
      diasVencidos: 0,
    },
    hasCredit: true,
    creditDays: 30,
    status: "pending" as const,
  },
  {
    id: "2",
    orderNumber: "227-A01GM-CEMEX",
    workCode: "227",
    workName: "CASTELLO E",
    supplier: "CEMEX",
    orderDate: "2025-12-05",
    totalAmount: 40078,
    paidAmount: 40078,
    payments: [
      {
        id: "p1",
        reference: "TRF-2025-0123",
        amount: 40078,
        date: "2025-12-20",
        method: "Transferencia",
      },
    ],
    invoice: {
      id: "inv2",
      folioFactura: "FACT-2025-998",
      montoFactura: 40078,
      fechaFactura: "2025-12-06",
      diasCredito: 30,
      fechaVencimiento: calculateDueDate("2025-12-06", 30),
      diasVencidos: 0,
    },
    hasCredit: true,
    creditDays: 30,
    status: "paid" as const,
  },
  {
    id: "3",
    orderNumber: "227-A02RS-LEVINSON",
    workCode: "227",
    workName: "CASTELLO E",
    supplier: "LEVINSON",
    orderDate: "2025-12-15",
    totalAmount: 40602,
    paidAmount: 20000,
    payments: [
      {
        id: "p2",
        reference: "CHQ-45678",
        amount: 20000,
        date: "2025-12-28",
        method: "Cheque",
      },
    ],
    invoice: {
      id: "inv3",
      folioFactura: "FACT-2025-875",
      montoFactura: 40602,
      fechaFactura: "2025-12-16",
      diasCredito: 15,
      fechaVencimiento: calculateDueDate("2025-12-16", 15),
      diasVencidos: calculateOverdueDays(calculateDueDate("2025-12-16", 15)),
    },
    hasCredit: true,
    creditDays: 15,
    status: "overdue" as const,
  },
  {
    id: "4",
    orderNumber: "228-A01JR-PIPA LUIS GOMEZ",
    workCode: "228",
    workName: "CASTELLO F",
    supplier: "PIPA LUIS GOMEZ",
    orderDate: "2026-01-07",
    totalAmount: 8500,
    paidAmount: 8500,
    payments: [
      {
        id: "p4",
        reference: "EFE-001",
        amount: 8500,
        date: "2026-01-07",
        method: "Efectivo",
      },
    ],
    invoice: null,
    hasCredit: false,
    creditDays: 0,
    status: "paid" as const,
  },
];
