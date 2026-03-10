/**
 * WAREHOUSE MANAGEMENT (Almacén)
 * 
 * Módulo para el ALMACENISTA:
 * - Registro de órdenes de compra en formato tabla
 * - Marcar material recibido (con remisión)
 * - Marcar material que salió
 * - Inventario = Recibido - Salió
 */

import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  ArrowLeft,
  Warehouse,
  AlertTriangle,
  Package,
  Search,
  ChevronDown,
  ChevronRight,
  Upload,
  FileText,
  Image as ImageIcon,
  Minus,
} from "lucide-react";

// Tipos
interface OrderMaterial {
  id: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  recibido: number;
  salio: number;
  remision?: string;
  remisionFoto?: string;
  fechaRecepcion?: string;
  notas?: string;
}

interface PurchaseOrder {
  id: string;
  fechaOC: string;
  obra: string;
  obraName: string;
  fechaEntregaEsperada: string;
  tipoEntrega: string;
  total: number;
  materiales: OrderMaterial[];
  expanded: boolean;
}

interface WarehouseManagementProps {
  onBack: () => void;
}

// Mock Data
const initialOrders: PurchaseOrder[] = [
  {
    id: "227-A01GM-CEMEX",
    fechaOC: "4/1/2025",
    obra: "227",
    obraName: "CASTELLO F",
    fechaEntregaEsperada: "19/1/2025",
    tipoEntrega: "Entrega",
    total: 40078.0,
    expanded: false,
    materiales: [
      {
        id: "M001",
        descripcion: "Cemento Gris CPC 30R",
        cantidad: 300,
        unidad: "BULTO",
        recibido: 300,
        salio: 120,
        remision: "REM-4521",
        fechaRecepcion: "23/1/2025",
      },
      {
        id: "M002",
        descripcion: "Arena fina de río",
        cantidad: 20,
        unidad: "M3",
        recibido: 20,
        salio: 8,
        remision: "REM-4521",
        fechaRecepcion: "23/1/2025",
      },
      {
        id: "M003",
        descripcion: "Grava 3/4\"",
        cantidad: 15,
        unidad: "M3",
        recibido: 15,
        salio: 15,
        remision: "REM-4522",
        fechaRecepcion: "24/1/2025",
      },
    ],
  },
  {
    id: "228-A01JR-INTERCERAMIC",
    fechaOC: "4/1/2025",
    obra: "228",
    obraName: "CASTELLO G",
    fechaEntregaEsperada: "24/1/2025",
    tipoEntrega: "Entrega",
    total: 89450.0,
    expanded: false,
    materiales: [
      {
        id: "M004",
        descripcion: "Piso porcelanato 60x60 gris",
        cantidad: 150,
        unidad: "M2",
        recibido: 150,
        salio: 0,
        remision: "REM-8841",
        remisionFoto: "FOTO-interceramic_001.jpg",
        fechaRecepcion: "28/1/2025",
      },
      {
        id: "M005",
        descripcion: "Adhesivo para porcelanato",
        cantidad: 50,
        unidad: "BULTO",
        recibido: 50,
        salio: 15,
        remision: "REM-8841",
        fechaRecepcion: "28/1/2025",
      },
    ],
  },
  {
    id: "229-A01GM-BEREL",
    fechaOC: "3/1/2025",
    obra: "229",
    obraName: "CASTELLO H",
    fechaEntregaEsperada: "17/1/2025",
    tipoEntrega: "Recolección",
    total: 25600.0,
    expanded: false,
    materiales: [
      {
        id: "M006",
        descripcion: "Pintura Vinílica Blanco 19L",
        cantidad: 30,
        unidad: "CUBETA",
        recibido: 20,
        salio: 0,
        remision: "REM-5521",
        fechaRecepcion: "21/1/2025",
        notas: "Recepción parcial. Faltan 10 cubetas.",
      },
      {
        id: "M007",
        descripcion: "Sellador acrílico 19L",
        cantidad: 20,
        unidad: "CUBETA",
        recibido: 20,
        salio: 8,
        remision: "REM-5521",
        fechaRecepcion: "21/1/2025",
      },
    ],
  },
  {
    id: "231-A01RS-CEMEX",
    fechaOC: "5/1/2025",
    obra: "231",
    obraName: "DOZA A",
    fechaEntregaEsperada: "27/1/2025",
    tipoEntrega: "Entrega",
    total: 32500.0,
    expanded: false,
    materiales: [
      {
        id: "M008",
        descripcion: "Cemento Gris CPC 30R",
        cantidad: 200,
        unidad: "BULTO",
        recibido: 0,
        salio: 0,
        notas: "Pendiente de recibir",
      },
      {
        id: "M009",
        descripcion: "Arena fina de río",
        cantidad: 15,
        unidad: "M3",
        recibido: 0,
        salio: 0,
        notas: "Pendiente de recibir",
      },
    ],
  },
  {
    id: "232-A02LM-COMEX",
    fechaOC: "6/1/2025",
    obra: "232",
    obraName: "BALVANERA",
    fechaEntregaEsperada: "14/2/2025",
    tipoEntrega: "Entrega",
    total: 18900.0,
    expanded: false,
    materiales: [
      {
        id: "M010",
        descripcion: "Pintura esmalte rojo 19L",
        cantidad: 25,
        unidad: "CUBETA",
        recibido: 0,
        salio: 0,
        notas: "Pendiente de recibir",
      },
      {
        id: "M011",
        descripcion: "Thinner estándar",
        cantidad: 40,
        unidad: "LITRO",
        recibido: 0,
        salio: 0,
        notas: "Pendiente de recibir",
      },
    ],
  },
  {
    id: "230-A03GM-FERREMAX",
    fechaOC: "7/1/2025",
    obra: "230",
    obraName: "DOZA C",
    fechaEntregaEsperada: "20/2/2025",
    tipoEntrega: "Recolección",
    total: 12450.0,
    expanded: false,
    materiales: [
      {
        id: "M012",
        descripcion: "Varilla corrugada 3/8\"",
        cantidad: 500,
        unidad: "PIEZA",
        recibido: 0,
        salio: 0,
        notas: "Pendiente de recibir",
      },
      {
        id: "M013",
        descripcion: "Alambre recocido #18",
        cantidad: 30,
        unidad: "KG",
        recibido: 0,
        salio: 0,
        notas: "Pendiente de recibir",
      },
      {
        id: "M014",
        descripcion: "Alambrón 1/4\"",
        cantidad: 200,
        unidad: "PIEZA",
        recibido: 0,
        salio: 0,
        notas: "Pendiente de recibir",
      },
    ],
  },
];

export default function WarehouseManagement({ onBack }: WarehouseManagementProps) {
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWork, setSelectedWork] = useState<string>("ALL");

  // Dialogs
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showSalidaDialog, setShowSalidaDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<{
    orderId: string;
    material: OrderMaterial;
  } | null>(null);

  const [receiveForm, setReceiveForm] = useState({
    cantidad: "",
    remision: "",
    fechaRecepcion: new Date().toISOString().split("T")[0], // Hoy por defecto, pero editable
    notas: "",
    foto: null as File | null,
  });

  const [salidaForm, setSalidaForm] = useState({
    cantidad: "",
    notas: "",
  });

  // Toggle expand
  const toggleOrder = (orderId: string) => {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, expanded: !o.expanded } : o))
    );
  };

  // Abrir dialog de recibir
  const handleOpenReceive = (orderId: string, material: OrderMaterial) => {
    setSelectedMaterial({ orderId, material });
    setReceiveForm({ cantidad: "", remision: "", fechaRecepcion: new Date().toISOString().split("T")[0], notas: "", foto: null });
    setShowReceiveDialog(true);
  };

  // Abrir dialog de salida
  const handleOpenSalida = (orderId: string, material: OrderMaterial) => {
    setSelectedMaterial({ orderId, material });
    setSalidaForm({ cantidad: "", notas: "" });
    setShowSalidaDialog(true);
  };

  // Guardar recepción
  const handleSaveReceive = () => {
    if (!selectedMaterial) return;
    const cantidad = parseFloat(receiveForm.cantidad);
    if (isNaN(cantidad) || cantidad <= 0) return;

    setOrders(
      orders.map((order) => {
        if (order.id === selectedMaterial.orderId) {
          return {
            ...order,
            materiales: order.materiales.map((mat) =>
              mat.id === selectedMaterial.material.id
                ? {
                    ...mat,
                    recibido: mat.recibido + cantidad,
                    remision: receiveForm.remision || mat.remision,
                    remisionFoto: receiveForm.foto
                      ? `FOTO-${receiveForm.foto.name}`
                      : mat.remisionFoto,
                    fechaRecepcion: receiveForm.fechaRecepcion,
                    notas: receiveForm.notas || mat.notas,
                  }
                : mat
            ),
          };
        }
        return order;
      })
    );

    setShowReceiveDialog(false);
    setSelectedMaterial(null);
  };

  // Guardar salida
  const handleSaveSalida = () => {
    if (!selectedMaterial) return;
    const cantidad = parseFloat(salidaForm.cantidad);
    if (isNaN(cantidad) || cantidad <= 0) return;

    setOrders(
      orders.map((order) => {
        if (order.id === selectedMaterial.orderId) {
          return {
            ...order,
            materiales: order.materiales.map((mat) =>
              mat.id === selectedMaterial.material.id
                ? {
                    ...mat,
                    salio: mat.salio + cantidad,
                    notas: salidaForm.notas || mat.notas,
                  }
                : mat
            ),
          };
        }
        return order;
      })
    );

    setShowSalidaDialog(false);
    setSelectedMaterial(null);
  };

  // Calcular inventario
  const calcularInventario = () => {
    const inventarioMap = new Map();

    orders.forEach((order) => {
      order.materiales.forEach((mat) => {
        const queda = mat.recibido - mat.salio;
        if (queda > 0) {
          const key = `${mat.descripcion}-${mat.unidad}`;
          if (inventarioMap.has(key)) {
            const existing = inventarioMap.get(key);
            existing.cantidad += queda;
            existing.ubicaciones.push({
              oc: order.id,
              cantidad: queda,
              fechaRecepcion: mat.fechaRecepcion,
            });
          } else {
            inventarioMap.set(key, {
              descripcion: mat.descripcion,
              unidad: mat.unidad,
              cantidad: queda,
              ubicaciones: [
                {
                  oc: order.id,
                  cantidad: queda,
                  fechaRecepcion: mat.fechaRecepcion,
                },
              ],
            });
          }
        }
      });
    });

    return Array.from(inventarioMap.values());
  };

  // Filtros
  const filteredOrders = orders.filter((order) => {
    const matchesWork = selectedWork === "ALL" || order.obra === selectedWork;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesWork && matchesSearch;
  });

  const inventario = calcularInventario();

  // Alertas
  const materialesSinRecibir = orders.flatMap((order) =>
    order.materiales
      .filter((mat) => mat.recibido === 0)
      .map((mat) => ({
        oc: order.id,
        material: mat.descripcion,
        cantidad: mat.cantidad,
        unidad: mat.unidad,
      }))
  );

  const recepcionParcial = orders.flatMap((order) =>
    order.materiales
      .filter((mat) => mat.recibido > 0 && mat.recibido < mat.cantidad)
      .map((mat) => ({
        oc: order.id,
        material: mat.descripcion,
        ordenado: mat.cantidad,
        recibido: mat.recibido,
        faltante: mat.cantidad - mat.recibido,
        unidad: mat.unidad,
      }))
  );

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
                  <h1 className="text-3xl font-bold text-white">Almacén Central</h1>
                  <p className="text-orange-100">Control de recepción y salida de materiales</p>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedWork} onValueChange={setSelectedWork}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Filtrar por obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas las Obras</SelectItem>
                  <SelectItem value="227">227 - CASTELLO F</SelectItem>
                  <SelectItem value="228">228 - CASTELLO G</SelectItem>
                  <SelectItem value="229">229 - CASTELLO H</SelectItem>
                  <SelectItem value="230">230 - DOZA A</SelectItem>
                  <SelectItem value="231">231 - DOZA C</SelectItem>
                  <SelectItem value="232">232 - BALVANERA</SelectItem>
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
            <TabsTrigger value="alerts">
              Alertas
              {(materialesSinRecibir.length + recepcionParcial.length > 0) && (
                <Badge className="ml-2 bg-red-600 text-white">
                  {materialesSinRecibir.length + recepcionParcial.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ÓRDENES DE COMPRA */}
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

                {/* Filas de órdenes */}
                <div className="divide-y">
                  {filteredOrders.map((order) => (
                    <div key={order.id}>
                      {/* Fila de OC */}
                      <div className="grid grid-cols-10 gap-4 p-4 hover:bg-orange-50 transition-colors">
                        <div className="col-span-3">
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-xs text-gray-500">{order.fechaOC}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-gray-700">{order.obra}</p>
                          <p className="text-xs text-gray-500">{order.obraName}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-700">{order.fechaEntregaEsperada}</p>
                          <p className="text-xs text-gray-500">Programada</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <Badge variant="outline" className="text-xs">
                            {order.tipoEntrega}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleOrder(order.id)}
                          >
                            {order.expanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Tabla de materiales expandida */}
                      {order.expanded && (
                        <div className="bg-gray-50 border-t">
                          <div className="p-6">
                            {/* Header de tabla de materiales */}
                            <div className="bg-white rounded-lg border overflow-hidden">
                              <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 border-b text-xs font-semibold text-gray-700">
                                <div className="col-span-3">Descripción</div>
                                <div className="col-span-1 text-center">Cantidad</div>
                                <div className="col-span-1 text-center">Unidad</div>
                                <div className="col-span-1 text-center">Recibido</div>
                                <div className="col-span-1 text-center">Salió</div>
                                <div className="col-span-1 text-center">Queda</div>
                                <div className="col-span-2">Remisión</div>
                                <div className="col-span-2 text-right">Acciones</div>
                              </div>

                              {/* Materiales */}
                              <div className="divide-y">
                                {order.materiales.map((mat) => {
                                  const queda = mat.recibido - mat.salio;
                                  const faltaRecibir = mat.cantidad - mat.recibido;

                                  return (
                                    <div
                                      key={mat.id}
                                      className="grid grid-cols-12 gap-4 p-3 hover:bg-gray-50"
                                    >
                                      <div className="col-span-3">
                                        <p className="text-sm font-medium text-gray-900">
                                          {mat.descripcion}
                                        </p>
                                        {mat.fechaRecepcion && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Recibido: {mat.fechaRecepcion}
                                          </p>
                                        )}
                                        {mat.notas && (
                                          <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded mt-1">
                                            {mat.notas}
                                          </p>
                                        )}
                                      </div>
                                      <div className="col-span-1 text-center">
                                        <p className="text-sm font-semibold text-gray-900">
                                          {mat.cantidad}
                                        </p>
                                      </div>
                                      <div className="col-span-1 text-center">
                                        <p className="text-sm text-gray-600">{mat.unidad}</p>
                                      </div>
                                      <div className="col-span-1 text-center">
                                        <p
                                          className={`text-sm font-bold ${
                                            mat.recibido >= mat.cantidad
                                              ? "text-green-700"
                                              : mat.recibido > 0
                                              ? "text-amber-700"
                                              : "text-gray-400"
                                          }`}
                                        >
                                          {mat.recibido}
                                        </p>
                                      </div>
                                      <div className="col-span-1 text-center">
                                        <p className="text-sm font-semibold text-red-700">
                                          {mat.salio}
                                        </p>
                                      </div>
                                      <div className="col-span-1 text-center">
                                        <p
                                          className={`text-sm font-bold ${
                                            queda > 0 ? "text-blue-700" : "text-gray-400"
                                          }`}
                                        >
                                          {queda}
                                        </p>
                                      </div>
                                      <div className="col-span-2">
                                        {mat.remision && (
                                          <div className="flex items-center gap-1">
                                            <FileText className="h-3 w-3 text-gray-500" />
                                            <p className="text-xs text-gray-700">{mat.remision}</p>
                                          </div>
                                        )}
                                        {mat.remisionFoto && (
                                          <div className="flex items-center gap-1 mt-1">
                                            <ImageIcon className="h-3 w-3 text-blue-500" />
                                            <p className="text-xs text-blue-700">
                                              {mat.remisionFoto}
                                            </p>
                                          </div>
                                        )}
                                        {!mat.remision && !mat.remisionFoto && (
                                          <p className="text-xs text-gray-400">Sin remisión</p>
                                        )}
                                      </div>
                                      <div className="col-span-2 flex items-center justify-end gap-2">
                                        {faltaRecibir > 0 && (
                                          <Button
                                            size="sm"
                                            onClick={() => handleOpenReceive(order.id, mat)}
                                            className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-7"
                                          >
                                            + Recibir
                                          </Button>
                                        )}
                                        {queda > 0 && (
                                          <Button
                                            size="sm"
                                            onClick={() => handleOpenSalida(order.id, mat)}
                                            className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-7"
                                          >
                                            - Salida
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: INVENTARIO */}
          <TabsContent value="inventory">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle>Inventario en Bodega</CardTitle>
              </CardHeader>
              <CardContent>
                {inventario.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay materiales en bodega</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inventario.map((item, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="col-span-6">
                          <p className="font-semibold text-gray-900">{item.descripcion}</p>
                        </div>
                        <div className="col-span-2 text-center">
                          <p className="text-2xl font-bold text-orange-700">
                            {item.cantidad}
                          </p>
                        </div>
                        <div className="col-span-1 text-center">
                          <p className="text-sm text-gray-600">{item.unidad}</p>
                        </div>
                        <div className="col-span-3">
                          {item.ubicaciones.map((ub, ubIdx) => (
                            <div key={ubIdx} className="text-xs text-gray-600 mb-1">
                              <p className="font-medium">{ub.oc}</p>
                              <p>
                                {ub.cantidad} {item.unidad}
                                {ub.fechaRecepcion && ` • ${ub.fechaRecepcion}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: ALERTAS */}
          <TabsContent value="alerts" className="space-y-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Sin Recibir ({materialesSinRecibir.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {materialesSinRecibir.length === 0 ? (
                  <p className="text-gray-600">✓ Todos los materiales han sido recibidos</p>
                ) : (
                  <div className="space-y-2">
                    {materialesSinRecibir.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-red-300"
                      >
                        <p className="font-semibold">{item.material}</p>
                        <p className="text-sm text-gray-600">
                          OC: {item.oc} • {item.cantidad} {item.unidad}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recepción Parcial ({recepcionParcial.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recepcionParcial.length === 0 ? (
                  <p className="text-gray-600">✓ No hay recepciones parciales</p>
                ) : (
                  <div className="space-y-2">
                    {recepcionParcial.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-amber-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{item.material}</p>
                            <p className="text-sm text-gray-600">
                              OC: {item.oc} • Recibido: {item.recibido}/{item.ordenado}{" "}
                              {item.unidad}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-amber-200">
                            Faltan {item.faltante} {item.unidad}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog - Recibir Material */}
      <Dialog open={showReceiveDialog} onOpenChange={setShowReceiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar Material Recibido</DialogTitle>
            <DialogDescription>
              Registre la cantidad recibida y adjunte la remisión
            </DialogDescription>
          </DialogHeader>

          {selectedMaterial && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">{selectedMaterial.material.descripcion}</p>
                <p className="text-sm text-gray-600">
                  Ordenado: {selectedMaterial.material.cantidad}{" "}
                  {selectedMaterial.material.unidad}
                </p>
                <p className="text-sm text-red-600">
                  Falta recibir:{" "}
                  {selectedMaterial.material.cantidad -
                    selectedMaterial.material.recibido}{" "}
                  {selectedMaterial.material.unidad}
                </p>
              </div>

              <div>
                <Label>Cantidad Recibida</Label>
                <Input
                  type="number"
                  value={receiveForm.cantidad}
                  onChange={(e) =>
                    setReceiveForm({ ...receiveForm, cantidad: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <Label>Número de Remisión</Label>
                <Input
                  value={receiveForm.remision}
                  onChange={(e) =>
                    setReceiveForm({ ...receiveForm, remision: e.target.value })
                  }
                  placeholder="REM-12345"
                />
              </div>

              <div>
                <Label>O adjuntar foto de remisión</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setReceiveForm({ ...receiveForm, foto: file || null });
                  }}
                  className="mt-1"
                />
                {receiveForm.foto && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {receiveForm.foto.name}
                  </p>
                )}
              </div>

              <div>
                <Label>Fecha de Recepción</Label>
                <Input
                  type="date"
                  value={receiveForm.fechaRecepcion}
                  onChange={(e) =>
                    setReceiveForm({ ...receiveForm, fechaRecepcion: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Notas</Label>
                <Input
                  value={receiveForm.notas}
                  onChange={(e) =>
                    setReceiveForm({ ...receiveForm, notas: e.target.value })
                  }
                  placeholder="Opcional"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReceiveDialog(false);
                setSelectedMaterial(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveReceive}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar Recepción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog - Registrar Salida */}
      <Dialog open={showSalidaDialog} onOpenChange={setShowSalidaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Salida de Material</DialogTitle>
            <DialogDescription>
              Registre la cantidad de material que salió del almacén
            </DialogDescription>
          </DialogHeader>

          {selectedMaterial && (
            <div className="space-y-4 py-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold">{selectedMaterial.material.descripcion}</p>
                <p className="text-sm text-gray-600">
                  Disponible:{" "}
                  {selectedMaterial.material.recibido - selectedMaterial.material.salio}{" "}
                  {selectedMaterial.material.unidad}
                </p>
              </div>

              <div>
                <Label>Cantidad que Salió</Label>
                <Input
                  type="number"
                  value={salidaForm.cantidad}
                  onChange={(e) =>
                    setSalidaForm({ ...salidaForm, cantidad: e.target.value })
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <Label>Notas</Label>
                <Input
                  value={salidaForm.notas}
                  onChange={(e) =>
                    setSalidaForm({ ...salidaForm, notas: e.target.value })
                  }
                  placeholder="Opcional"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSalidaDialog(false);
                setSelectedMaterial(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveSalida}
              className="bg-red-600 hover:bg-red-700"
            >
              <Minus className="h-4 w-4 mr-2" />
              Confirmar Salida
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}