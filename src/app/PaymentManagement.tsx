import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { ViewState } from "@/app/components/states";
import {
  PaymentManagementStateLoading,
  PaymentManagementStateError,
  PaymentManagementStateEmpty,
} from "@/app/components/payment-management";
import { purchaseOrdersPaymentMock } from "/spec/pagos/purchase-orders-payment.mock";
import {
  Upload,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  X,
  Receipt,
  FileDown,
  Plus,
  Trash2,
} from "lucide-react";

interface Invoice {
  id: string;
  folioFactura: string;
  montoFactura: number;
  fechaFactura: string;
  diasCredito: number;
  fechaVencimiento: string;
  diasVencidos: number;
}

interface PaymentReference {
  id: string;
  reference: string;
  amount: number;
  date: string;
  method: string;
}

interface PurchaseOrderPayment {
  id: string;
  orderNumber: string;
  workCode: string;
  workName: string;
  supplier: string;
  orderDate: string;
  totalAmount: number;
  paidAmount: number;
  payments: PaymentReference[];
  invoice: Invoice | null;
  hasCredit: boolean; // Si el proveedor da crédito
  creditDays: number; // Días de crédito (0 si no tiene)
  status: "paid" | "partial" | "pending" | "overdue" | "not_invoiced" | "na";
}

// Base de datos de proveedores con días de crédito
const supplierCreditDatabase: Record<string, number> = {
  "CEMEX": 30,
  "POLIESTIRENOS": 30,
  "FERREMAT": 40,
  "LEVINSON": 15,
  "INTERCERAMIC": 30,
  "BEREL": 45,
  "HIERROS": 20,
  "PIPA LUIS GOMEZ": 0, // Sin crédito - pago inmediato
  "ELECTRICSA": 25,
  "PINTURAMA": 30,
};

// Función para calcular fecha de vencimiento
const calculateDueDate = (fechaFactura: string, diasCredito: number): string => {
  const date = new Date(fechaFactura);
  date.setDate(date.getDate() + diasCredito);
  return date.toISOString().split('T')[0];
};

// Función para calcular días vencidos
const calculateOverdueDays = (fechaVencimiento: string): number => {
  const today = new Date(); // Fecha actual del dispositivo
  today.setHours(0, 0, 0, 0); // Resetear horas para comparación exacta de días
  const dueDate = new Date(fechaVencimiento);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - dueDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const mockPurchaseOrders: PurchaseOrderPayment[] = purchaseOrdersPaymentMock;

interface PaymentManagementProps {
  initialState?: ViewState;
}

export default function PaymentManagement({ initialState = "data" }: PaymentManagementProps = {}) {
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [orders, setOrders] = useState<PurchaseOrderPayment[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrderPayment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  
  const [newPayment, setNewPayment] = useState({
    reference: "",
    amount: 0,
    date: "",
    method: "Transferencia",
  });

  const [newInvoice, setNewInvoice] = useState({
    folioFactura: "",
    montoFactura: 0,
    fechaFactura: "",
  });

  const handleAddInvoice = () => {
    if (!selectedOrder || !newInvoice.folioFactura || newInvoice.montoFactura <= 0 || !newInvoice.fechaFactura) {
      return;
    }

    const creditDays = supplierCreditDatabase[selectedOrder.supplier] || 0;
    const fechaVencimiento = calculateDueDate(newInvoice.fechaFactura, creditDays);
    const diasVencidos = calculateOverdueDays(fechaVencimiento);

    const invoice: Invoice = {
      id: `inv${Date.now()}`,
      folioFactura: newInvoice.folioFactura,
      montoFactura: newInvoice.montoFactura,
      fechaFactura: newInvoice.fechaFactura,
      diasCredito: creditDays,
      fechaVencimiento: fechaVencimiento,
      diasVencidos: diasVencidos,
    };

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          invoice: invoice,
          status: diasVencidos > 0 ? "overdue" : "pending",
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setShowInvoiceModal(false);
    setSelectedOrder(null);
    setNewInvoice({
      folioFactura: "",
      montoFactura: 0,
      fechaFactura: "",
    });
  };

  const handleAddPayment = () => {
    if (!selectedOrder || !newPayment.reference || newPayment.amount <= 0 || !newPayment.date) {
      return;
    }

    const payment: PaymentReference = {
      id: `p${Date.now()}`,
      reference: newPayment.reference,
      amount: newPayment.amount,
      date: newPayment.date,
      method: newPayment.method,
    };

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const newPaidAmount = order.paidAmount + payment.amount;
        let newStatus = order.status;
        
        if (newPaidAmount >= order.totalAmount) {
          newStatus = "paid";
        } else if (newPaidAmount > 0) {
          newStatus = "partial";
        }

        return {
          ...order,
          paidAmount: newPaidAmount,
          payments: [...order.payments, payment],
          status: newStatus,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setNewPayment({
      reference: "",
      amount: 0,
      date: "",
      method: "Transferencia",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.workName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Pagado" && order.status === "paid") ||
      (statusFilter === "Parcial" && order.status === "partial") ||
      (statusFilter === "Pendiente" && order.status === "pending") ||
      (statusFilter === "Vencido" && order.status === "overdue") ||
      (statusFilter === "Sin Factura" && order.status === "not_invoiced");

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    partial: orders.filter((o) => o.status === "partial").length,
    pending: orders.filter((o) => o.status === "pending").length,
    overdue: orders.filter((o) => o.status === "overdue").length,
    notInvoiced: orders.filter((o) => o.status === "not_invoiced").length,
    totalAmount: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    paidAmount: orders.reduce((sum, o) => sum + o.paidAmount, 0),
  };

  const getStatusBadge = (order: PurchaseOrderPayment) => {
    const percentage = (order.paidAmount / order.totalAmount) * 100;

    if (!order.hasCredit) {
      // Proveedores sin crédito - pago inmediato
      if (order.status === "paid") {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Pagado
          </Badge>
        );
      }
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
          N/A - Pago Inmediato
        </Badge>
      );
    }

    // Proveedores con crédito
    if (order.status === "paid") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Pagado
        </Badge>
      );
    }

    if (order.status === "not_invoiced") {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
          <FileText className="h-3 w-3 mr-1" />
          Sin Factura
        </Badge>
      );
    }

    if (order.status === "overdue") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 animate-pulse">
          <AlertCircle className="h-3 w-3 mr-1" />
          Vencido
        </Badge>
      );
    }

    if (order.status === "partial") {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300">
          <Clock className="h-3 w-3 mr-1" />
          Parcial {percentage.toFixed(0)}%
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
        <Clock className="h-3 w-3 mr-1" />
        Pendiente
      </Badge>
    );
  };

  const getCreditInfo = (order: PurchaseOrderPayment) => {
    if (!order.hasCredit) {
      return <span className="text-gray-500 text-xs">Pago Inmediato</span>;
    }

    if (order.status === "paid") {
      return <span className="text-green-600 font-semibold text-xs">Pagado</span>;
    }

    if (!order.invoice) {
      return <span className="text-purple-600 font-semibold text-xs">Sin Factura</span>;
    }

    const diasVencidos = calculateOverdueDays(order.invoice.fechaVencimiento);
    
    if (diasVencidos > 0) {
      return (
        <div className="text-xs">
          <span className="text-red-600 font-bold animate-pulse block">
            ¡Vencido!
          </span>
          <span className="text-red-500">
            {diasVencidos} día{diasVencidos !== 1 ? 's' : ''} de retraso
          </span>
        </div>
      );
    }

    const today = new Date();
    const dueDate = new Date(order.invoice.fechaVencimiento);
    const diffTime = dueDate.getTime() - today.getTime();
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diasRestantes <= 5) {
      return (
        <span className="text-orange-600 font-semibold text-xs">
          {diasRestantes} día{diasRestantes !== 1 ? 's' : ''}
        </span>
      );
    }

    return (
      <span className="text-blue-600 font-semibold text-xs">
        {diasRestantes} d��a{diasRestantes !== 1 ? 's' : ''}
      </span>
    );
  };

  // Handlers placeholder
  const handleRetry = () => {
    console.log("Reintentar carga");
    setViewState("loading");
    setTimeout(() => setViewState("data"), 1000);
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <PaymentManagementStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <PaymentManagementStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return <PaymentManagementStateEmpty />;
  }

  // ESTADO: DATA (contenido completo original)
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
        
        <Button
          onClick={() => setShowCSVModal(true)}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Upload className="h-4 w-4" />
          Importar CSV Bancario
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total OCs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pagadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Parciales</p>
                <p className="text-2xl font-bold text-orange-600">{stats.partial}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vencidos</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Sin Factura</p>
                <p className="text-2xl font-bold text-purple-600">{stats.notInvoiced}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Amount Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monto Total en OCs</p>
                <p className="text-2xl font-bold">
                  ${stats.totalAmount.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
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
                <p className="text-sm text-muted-foreground mb-1">Monto Pagado</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.paidAmount.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.paidAmount / stats.totalAmount) * 100).toFixed(1)}% del total
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por folio, proveedor o obra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los estados</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Parcial">Pago Parcial</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
                <SelectItem value="Sin Factura">Sin Factura</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
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
                {filteredOrders.map((order) => {
                  const percentage = (order.paidAmount / order.totalAmount) * 100;
                  const pendingAmount = order.totalAmount - order.paidAmount;

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-50 ${
                        order.status === "paid"
                          ? "bg-green-50/30"
                          : order.status === "overdue"
                          ? "bg-red-50/30"
                          : order.status === "partial"
                          ? "bg-orange-50/30"
                          : order.status === "not_invoiced"
                          ? "bg-purple-50/30"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-3 text-xs">
                        {new Date(order.orderDate).toLocaleDateString("es-MX")}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-mono text-xs font-semibold">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {order.workName}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs font-medium">
                        {order.supplier}
                        {!order.hasCredit && (
                          <Badge variant="outline" className="ml-1 text-[9px]">
                            Sin Crédito
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {order.invoice ? (
                          <div className="text-xs font-mono">
                            {order.invoice.folioFactura}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center text-xs">
                        {order.invoice ? (
                          new Date(order.invoice.fechaFactura).toLocaleDateString("es-MX")
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right text-xs font-semibold">
                        ${order.totalAmount.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div
                          className={`text-xs font-semibold ${
                            order.paidAmount === 0
                              ? "text-gray-500"
                              : order.paidAmount >= order.totalAmount
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          ${order.paidAmount.toLocaleString("es-MX", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                        {order.paidAmount > 0 && order.paidAmount < order.totalAmount && (
                          <div className="text-[10px] text-red-600">
                            Pendiente: $
                            {pendingAmount.toLocaleString("es-MX", {
                              minimumFractionDigits: 2,
                            })}
                          </div>
                        )}
                        {order.paidAmount > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className={`h-1 rounded-full ${
                                percentage === 100
                                  ? "bg-green-600"
                                  : "bg-orange-500"
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {getCreditInfo(order)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {getStatusBadge(order)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1 justify-center flex-wrap">
                          {/* Botón Añadir Factura */}
                          {order.hasCredit && !order.invoice && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewInvoice({
                                  folioFactura: "",
                                  montoFactura: order.totalAmount,
                                  fechaFactura: new Date().toISOString().split("T")[0],
                                });
                                setShowInvoiceModal(true);
                              }}
                              className="gap-1 text-xs h-7"
                            >
                              <FileText className="h-3 w-3" />
                              Factura
                            </Button>
                          )}
                          
                          {/* Botón Añadir Pago */}
                          {order.status !== "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewPayment({
                                  ...newPayment,
                                  amount: order.totalAmount - order.paidAmount,
                                  date: new Date().toISOString().split("T")[0],
                                });
                                setShowPaymentModal(true);
                              }}
                              className="gap-1 text-xs h-7"
                            >
                              <Plus className="h-3 w-3" />
                              Pago
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground">
                No se encontraron órdenes de compra
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Añadir Factura</CardTitle>
                  <p className="text-sm text-purple-100 mt-1">
                    {selectedOrder.orderNumber} - {selectedOrder.supplier}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-white hover:bg-purple-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Order Info */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Proveedor:</span>
                  <span className="font-semibold">{selectedOrder.supplier}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Días de Crédito:</span>
                  <span className="font-semibold text-blue-600">
                    {supplierCreditDatabase[selectedOrder.supplier] || 0} días
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monto OC:</span>
                  <span className="font-bold text-lg">
                    ${selectedOrder.totalAmount.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Invoice Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folioFactura">Folio de Factura *</Label>
                  <Input
                    id="folioFactura"
                    value={newInvoice.folioFactura}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, folioFactura: e.target.value })
                    }
                    placeholder="FACT-2026-001"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="montoFactura">Monto de Factura *</Label>
                    <Input
                      id="montoFactura"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newInvoice.montoFactura}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          montoFactura: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Puede facturar en partes (monto parcial)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaFactura">Fecha de Factura *</Label>
                    <Input
                      id="fechaFactura"
                      type="date"
                      value={newInvoice.fechaFactura}
                      onChange={(e) =>
                        setNewInvoice({ ...newInvoice, fechaFactura: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Inicia el conteo de días de crédito
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {newInvoice.fechaFactura && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Vista Previa del Crédito
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Fecha de Vencimiento:</strong>{" "}
                        {new Date(
                          calculateDueDate(
                            newInvoice.fechaFactura,
                            supplierCreditDatabase[selectedOrder.supplier] || 0
                          )
                        ).toLocaleDateString("es-MX")}
                      </p>
                      <p>
                        <strong>Días de Crédito:</strong>{" "}
                        {supplierCreditDatabase[selectedOrder.supplier] || 0} días
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInvoiceModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddInvoice}
                  disabled={
                    !newInvoice.folioFactura ||
                    newInvoice.montoFactura <= 0 ||
                    !newInvoice.fechaFactura
                  }
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Registrar Factura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Registrar Pago</CardTitle>
                  <p className="text-sm text-emerald-100 mt-1">
                    {selectedOrder.orderNumber} - {selectedOrder.supplier}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-white hover:bg-emerald-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monto Total:</span>
                  <span className="font-semibold">
                    ${selectedOrder.totalAmount.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ya Pagado:</span>
                  <span className="font-semibold text-green-600">
                    ${selectedOrder.paidAmount.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Saldo Pendiente:</span>
                  <span className="font-bold text-lg text-red-600">
                    $
                    {(selectedOrder.totalAmount - selectedOrder.paidAmount).toLocaleString(
                      "es-MX",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reference">Referencia/Folio *</Label>
                    <Input
                      id="reference"
                      value={newPayment.reference}
                      onChange={(e) =>
                        setNewPayment({ ...newPayment, reference: e.target.value })
                      }
                      placeholder="TRF-2026-0123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="method">Método de Pago</Label>
                    <Select
                      value={newPayment.method}
                      onValueChange={(value) =>
                        setNewPayment({ ...newPayment, method: value })
                      }
                    >
                      <SelectTrigger id="method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Transferencia">Transferencia</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                        <SelectItem value="Efectivo">Efectivo</SelectItem>
                        <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto del Pago *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha de Pago *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newPayment.date}
                      onChange={(e) =>
                        setNewPayment({ ...newPayment, date: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="space-y-2">
                  <Label>Montos Rápidos</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNewPayment({
                          ...newPayment,
                          amount: selectedOrder.totalAmount - selectedOrder.paidAmount,
                        })
                      }
                    >
                      Saldo Total
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNewPayment({
                          ...newPayment,
                          amount:
                            (selectedOrder.totalAmount - selectedOrder.paidAmount) / 2,
                        })
                      }
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setNewPayment({
                          ...newPayment,
                          amount:
                            ((selectedOrder.totalAmount - selectedOrder.paidAmount) / 3) *
                            2,
                        })
                      }
                    >
                      66%
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddPayment}
                  disabled={
                    !newPayment.reference ||
                    newPayment.amount <= 0 ||
                    !newPayment.date
                  }
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Registrar Pago
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Importar CSV Estado de Cuenta Bancario</CardTitle>
                  <p className="text-sm text-blue-100 mt-1">
                    Macheo automático de pagos por Código OC y Monto
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCSVModal(false)}
                  className="text-white hover:bg-blue-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Instructions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Formato del CSV
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>El archivo CSV debe contener las siguientes columnas:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li><strong>Fecha</strong> - Fecha del movimiento</li>
                    <li><strong>Descripción/Concepto</strong> - Debe incluir el Código OC (ej: 230-A01JR-CEMEX)</li>
                    <li><strong>Monto</strong> - Cantidad transferida</li>
                    <li><strong>Referencia</strong> - Folio bancario</li>
                  </ul>
                  <p className="mt-2 pt-2 border-t border-blue-300">
                    <strong>Nota:</strong> El sistema buscará coincidencias por Código OC y comparará montos. 
                    Si el monto no coincide exactamente, se considerará un pago parcial/anticipo.
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm font-medium mb-1">
                    Arrastra tu archivo CSV aquí o haz click para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formato: .csv (máx. 5MB)
                  </p>
                  <Input
                    type="file"
                    accept=".csv"
                    className="mt-4"
                    onChange={(e) => {
                      // Aquí iría la lógica de importación CSV
                      console.log("Archivo seleccionado:", e.target.files?.[0]);
                    }}
                  />
                </div>

                {/* Example Preview */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-sm mb-2">Ejemplo de CSV:</h4>
                  <div className="bg-white p-3 rounded border font-mono text-xs overflow-x-auto">
                    <pre>
{`Fecha,Descripción,Monto,Referencia
2026-01-15,Pago OC 230-A01JR-CEMEX,40278.00,TRF-2026-0001
2026-01-16,Anticipo 227-A02RS-LEVINSON,20000.00,TRF-2026-0002
2026-01-17,Pago 231-A01RS-FERREMAT,15000.00,TRF-2026-0003`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCSVModal(false)}
                >
                  Cerrar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <FileDown className="h-4 w-4" />
                  Descargar Plantilla CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}