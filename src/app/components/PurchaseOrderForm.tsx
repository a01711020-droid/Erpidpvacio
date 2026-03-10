import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  worksDirectory,
  suppliersDirectory,
  buyers,
  getNextSequentialForWork,
  generatePurchaseOrderNumber,
} from "../utils/codeGenerators";

// Helper function to generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  workCode: string;
  workName: string;
  client: string;
  supplier: string;
  supplierFullName: string;
  supplierContact: string;
  supplierRFC?: string;
  supplierAddress?: string;
  supplierPhone?: string;
  supplierBank?: string;
  supplierAccount?: string;
  supplierCLABE?: string;
  buyer: string;
  deliveryDate: string;
  deliveryType: "Entrega" | "Recolección";
  hasIVA: boolean;
  discount: number;
  discountAmount: number;
  observations: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  iva: number;
  total: number;
  createdDate: string;
  status: "Pendiente" | "Aprobada" | "Rechazada" | "Entregada";
}

interface PurchaseOrderFormProps {
  onClose: () => void;
  onSave: (order: PurchaseOrder) => void;
  editOrder?: PurchaseOrder | null;
  requisitionData?: { workCode: string; workName: string; items: Array<{ description: string; quantity: number; unit: string }> } | null;
}

export function PurchaseOrderForm({
  onClose,
  onSave,
  editOrder,
  requisitionData,
}: PurchaseOrderFormProps) {
  const [workCode, setWorkCode] = useState(editOrder?.workCode || requisitionData?.workCode || "");
  const [supplier, setSupplier] = useState(editOrder?.supplier || "");
  const [buyer, setBuyer] = useState(editOrder?.buyer || "");
  const [orderNumber, setOrderNumber] = useState(editOrder?.orderNumber || "");
  
  // Auto-generate order number when work, buyer, and supplier are selected
  useEffect(() => {
    if (!editOrder && workCode && buyer && supplier) {
      const sequential = getNextSequentialForWork(workCode);
      const buyerData = buyers.find((b) => b.name === buyer);
      const buyerInitials = buyerData?.initials || "";
      const generatedNumber = generatePurchaseOrderNumber(
        workCode,
        sequential,
        buyerInitials,
        supplier
      );
      setOrderNumber(generatedNumber);
    }
  }, [workCode, buyer, supplier, editOrder]);

  const [workInfo, setWorkInfo] = useState<{
    name: string;
    client: string;
    contractNumber: string;
  } | null>(null);
  const [supplierInfo, setSupplierInfo] = useState<{
    fullName: string;
    contact: string;
    rfc?: string;
    address?: string;
    phone?: string;
    bank?: string;
    account?: string;
    clabe?: string;
  } | null>(null);
  
  // Calcular fecha de entrega por defecto: 2 días después de hoy
  const getDefaultDeliveryDate = () => {
    if (editOrder?.deliveryDate) {
      return editOrder.deliveryDate;
    }
    const today = new Date();
    today.setDate(today.getDate() + 2); // +2 días
    return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  const [deliveryDate, setDeliveryDate] = useState(getDefaultDeliveryDate());
  const [deliveryType, setDeliveryType] = useState<"Entrega" | "Recolección">(
    editOrder?.deliveryType || "Entrega"
  );
  const [hasIVA, setHasIVA] = useState(editOrder?.hasIVA ?? true);
  const [discountAmount, setDiscountAmount] = useState(editOrder?.discountAmount || 0);
  const [observations, setObservations] = useState(editOrder?.observations || "");
  const [items, setItems] = useState<PurchaseOrderItem[]>(() => {
    if (editOrder?.items) {
      return editOrder.items;
    }
    if (requisitionData?.items) {
      return requisitionData.items.map((item) => ({
        id: generateId(),
        description: `${item.description} (${item.unit})`,
        quantity: item.quantity,
        unitPrice: 0,
        total: 0,
      }));
    }
    return [
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ];
  });

  // Estados para colapsar/expandir las secciones
  const [isWorkInfoExpanded, setIsWorkInfoExpanded] = useState(false);
  const [isSupplierInfoExpanded, setIsSupplierInfoExpanded] = useState(false);
  
  // Auto-fill work information when code changes
  useEffect(() => {
    if (workCode && worksDirectory[workCode as keyof typeof worksDirectory]) {
      setWorkInfo(worksDirectory[workCode as keyof typeof worksDirectory]);
    } else {
      setWorkInfo(null);
    }
  }, [workCode]);

  // Auto-fill supplier information when supplier changes
  useEffect(() => {
    if (supplier && suppliersDirectory[supplier as keyof typeof suppliersDirectory]) {
      setSupplierInfo(suppliersDirectory[supplier as keyof typeof suppliersDirectory]);
    } else {
      setSupplierInfo(null);
    }
  }, [supplier]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof PurchaseOrderItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const iva = hasIVA ? subtotalAfterDiscount * 0.16 : 0;
  const total = subtotalAfterDiscount + iva;

  const handleSave = () => {
    const order: PurchaseOrder = {
      id: editOrder?.id || generateId(),
      orderNumber,
      workCode,
      workName: workInfo?.name || "",
      client: workInfo?.client || "",
      supplier,
      supplierFullName: supplierInfo?.fullName || "",
      supplierContact: supplierInfo?.contact || "",
      supplierRFC: supplierInfo?.rfc,
      supplierAddress: supplierInfo?.address,
      supplierPhone: supplierInfo?.phone,
      supplierBank: supplierInfo?.bank,
      supplierAccount: supplierInfo?.account,
      supplierCLABE: supplierInfo?.clabe,
      buyer,
      deliveryDate,
      deliveryType,
      hasIVA,
      discount: discountAmount,
      discountAmount,
      observations,
      items,
      subtotal,
      iva,
      total,
      createdDate: editOrder?.createdDate || new Date().toISOString().split("T")[0],
      status: editOrder?.status || "Pendiente",
    };
    onSave(order);
    onClose();
  };

  const isValid =
    orderNumber &&
    workCode &&
    workInfo &&
    supplier &&
    supplierInfo &&
    buyer &&
    deliveryDate &&
    items.length > 0 &&
    items.every((item) => item.description && item.quantity > 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editOrder ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">Departamento de Compras</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-800">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Order Number and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Número de OC *</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="OC-2025-001"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdDate">Fecha de Creación</Label>
                <Input
                  id="createdDate"
                  value={editOrder?.createdDate || new Date().toISOString().split("T")[0]}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Work Code Section */}
            <div className="space-y-3 p-4 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-blue-900">Información de Obra</h3>
                {workInfo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsWorkInfoExpanded(!isWorkInfoExpanded)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {isWorkInfoExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Ver detalles
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workCode">Código de Obra *</Label>
                  <Select value={workCode} onValueChange={setWorkCode}>
                    <SelectTrigger id="workCode">
                      <SelectValue placeholder="Seleccionar código de obra" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(worksDirectory).map((code) => (
                        <SelectItem key={code} value={code}>
                          {code} - {worksDirectory[code as keyof typeof worksDirectory].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {workInfo && isWorkInfoExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-blue-100">
                    <div className="space-y-2">
                      <Label>Nombre de Obra</Label>
                      <Input value={workInfo.name} disabled className="bg-blue-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cliente</Label>
                      <Input value={workInfo.client} disabled className="bg-blue-50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Contrato</Label>
                      <Input value={workInfo.contractNumber} disabled className="bg-blue-50" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supplier Section */}
            <div className="space-y-3 p-4 border-2 border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-green-900">Información de Proveedor</h3>
                {supplierInfo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSupplierInfoExpanded(!isSupplierInfoExpanded)}
                    className="text-green-600 hover:text-green-700"
                  >
                    {isSupplierInfoExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Ver detalles
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Proveedor (Código Corto) *</Label>
                  <Select value={supplier} onValueChange={setSupplier}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(suppliersDirectory).map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {supplierInfo && isSupplierInfoExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-green-100">
                    <div className="space-y-2">
                      <Label>Nombre Completo</Label>
                      <Input value={supplierInfo.fullName} disabled className="bg-green-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contacto</Label>
                      <Input value={supplierInfo.contact} disabled className="bg-green-50" />
                    </div>
                    {supplierInfo.rfc && (
                      <div className="space-y-2">
                        <Label>RFC</Label>
                        <Input value={supplierInfo.rfc} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.address && (
                      <div className="space-y-2">
                        <Label>Dirección</Label>
                        <Input value={supplierInfo.address} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.phone && (
                      <div className="space-y-2">
                        <Label>Teléfono</Label>
                        <Input value={supplierInfo.phone} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.bank && (
                      <div className="space-y-2">
                        <Label>Banco</Label>
                        <Input value={supplierInfo.bank} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.account && (
                      <div className="space-y-2">
                        <Label>Cuenta</Label>
                        <Input value={supplierInfo.account} disabled className="bg-green-50" />
                      </div>
                    )}
                    {supplierInfo.clabe && (
                      <div className="space-y-2">
                        <Label>CLABE</Label>
                        <Input value={supplierInfo.clabe} disabled className="bg-green-50" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyer">Comprador *</Label>
                <Select value={buyer} onValueChange={setBuyer}>
                  <SelectTrigger id="buyer">
                    <SelectValue placeholder="Seleccionar comprador" />
                  </SelectTrigger>
                  <SelectContent>
                    {buyers.map((b) => (
                      <SelectItem key={b.name} value={b.name}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Fecha de Entrega *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryType">Tipo de Entrega *</Label>
                <Select
                  value={deliveryType}
                  onValueChange={(value) => setDeliveryType(value as "Entrega" | "Recolección")}
                >
                  <SelectTrigger id="deliveryType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrega">Entrega</SelectItem>
                    <SelectItem value="Recolección">Recolección</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Conceptos de Compra</Label>
                <Button onClick={addItem} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Concepto
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                          Precio Unitario
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                          Total
                        </th>
                        <th className="px-4 py-3 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <Input
                              value={item.description}
                              onChange={(e) =>
                                updateItem(item.id, "description", e.target.value)
                              }
                              placeholder="Descripción del material o servicio"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "quantity",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "unitPrice",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              ${item.total.toLocaleString("es-MX", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="hasIVA">IVA *</Label>
                <Select
                  value={hasIVA ? "Si" : "No"}
                  onValueChange={(value) => setHasIVA(value === "Si")}
                >
                  <SelectTrigger id="hasIVA">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Si">Sí (16%)</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Descuento (Monto $)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-96 space-y-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">Subtotal:</span>
                  <span className="font-semibold">
                    ${subtotal.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b text-orange-600">
                    <span className="text-sm">Descuento:</span>
                    <span className="font-semibold">
                      -${discountAmount.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                {hasIVA && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">IVA (16%):</span>
                    <span className="font-semibold">
                      ${iva.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-t-2">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${total.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <textarea
                id="observations"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Condiciones especiales, instrucciones de entrega, etc."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700">
            {editOrder ? "Guardar Cambios" : "Crear Orden de Compra"}
          </Button>
        </div>
      </div>
    </div>
  );
}