import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Trash2, MessageSquare, Zap, Clock, Calendar, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { worksDirectory } from "../utils/codeGenerators";

// Helper function to generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export interface RequisitionItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface Comment {
  id: string;
  author: string;
  role: "Residente" | "Compras";
  message: string;
  timestamp: string;
}

export interface MaterialRequisition {
  id: string;
  requisitionNumber: string;
  workCode: string;
  workName: string;
  residentName: string;
  items: RequisitionItem[];
  comments: Comment[];
  status: "En Revisión" | "Comprado";
  createdDate: string;
  urgency: "Urgente" | "Normal" | "Planeado";
  deliveryNeededBy: string;
}

interface MaterialRequisitionFormProps {
  onClose: () => void;
  onSave: (requisition: MaterialRequisition) => void;
  editRequisition?: MaterialRequisition | null;
  userRole: "Residente" | "Compras";
  userWorkCode?: string; // For residents, restricted to their work
}

const units = [
  "PZA", // Pieza
  "M", // Metro
  "M2", // Metro cuadrado
  "M3", // Metro cúbico
  "KG", // Kilogramo
  "TON", // Tonelada
  "LT", // Litro
  "BULTO",
  "CAJA",
  "COSTAL",
  "ROLLO",
  "JUEGO",
  "LOTE",
];

export function MaterialRequisitionForm({
  onClose,
  onSave,
  editRequisition,
  userRole,
  userWorkCode,
}: MaterialRequisitionFormProps) {
  const [requisitionNumber, setRequisitionNumber] = useState(
    editRequisition?.requisitionNumber || `REQ-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`
  );
  const [workCode, setWorkCode] = useState(editRequisition?.workCode || userWorkCode || "");
  const [workInfo, setWorkInfo] = useState<{
    name: string;
    resident: string;
  } | null>(null);
  const [urgency, setUrgency] = useState<MaterialRequisition["urgency"]>(
    editRequisition?.urgency || "Normal"
  );
  const [deliveryNeededBy, setDeliveryNeededBy] = useState(
    editRequisition?.deliveryNeededBy || ""
  );
  const [items, setItems] = useState<RequisitionItem[]>(
    editRequisition?.items || [
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unit: "PZA",
      },
    ]
  );
  const [comments, setComments] = useState<Comment[]>(
    editRequisition?.comments || []
  );
  const [newComment, setNewComment] = useState("");

  // Auto-fill work information when code changes
  useEffect(() => {
    if (workCode && worksDirectory[workCode as keyof typeof worksDirectory]) {
      setWorkInfo(worksDirectory[workCode as keyof typeof worksDirectory]);
    } else {
      setWorkInfo(null);
    }
  }, [workCode]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        description: "",
        quantity: 1,
        unit: "PZA",
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
    field: keyof RequisitionItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: generateId(),
        author: userRole === "Residente" ? workInfo?.resident || "Residente" : "Departamento de Compras",
        role: userRole,
        message: newComment,
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleSave = () => {
    const requisition: MaterialRequisition = {
      id: editRequisition?.id || generateId(),
      requisitionNumber,
      workCode,
      workName: workInfo?.name || "",
      residentName: workInfo?.resident || "",
      items,
      comments,
      status: editRequisition?.status || "En Revisión",
      createdDate: editRequisition?.createdDate || new Date().toISOString().split("T")[0],
      urgency,
      deliveryNeededBy,
    };
    onSave(requisition);
    onClose();
  };

  const isValid =
    requisitionNumber &&
    workCode &&
    workInfo &&
    deliveryNeededBy &&
    items.length > 0 &&
    items.every((item) => item.description && item.quantity > 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-amber-700 to-orange-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editRequisition ? "Editar Requisición" : "Nueva Requisición de Material"}
            </h2>
            <p className="text-amber-100 text-sm mt-1">
              {userRole === "Residente" ? "Solicitud de Materiales" : "Gestión de Requisiciones"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-amber-800">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Requisition Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="requisitionNumber">Número de Requisición</Label>
                <Input
                  id="requisitionNumber"
                  value={requisitionNumber}
                  onChange={(e) => setRequisitionNumber(e.target.value)}
                  className="font-mono"
                  disabled={userRole === "Residente"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdDate">Fecha de Solicitud</Label>
                <Input
                  id="createdDate"
                  value={editRequisition?.createdDate || new Date().toISOString().split("T")[0]}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg">¿Cuándo necesitas este material? *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Urgente */}
                  <button
                    type="button"
                    onClick={() => setUrgency("Urgente")}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      urgency === "Urgente"
                        ? "border-red-500 bg-red-50 shadow-lg scale-105"
                        : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-3 rounded-lg ${
                          urgency === "Urgente" ? "bg-red-500" : "bg-red-100"
                        }`}
                      >
                        <Zap
                          className={`h-6 w-6 ${
                            urgency === "Urgente" ? "text-white fill-white" : "text-red-600 fill-red-600"
                          }`}
                        />
                      </div>
                      {urgency === "Urgente" && (
                        <CheckCircle className="h-6 w-6 text-red-600 ml-auto" />
                      )}
                    </div>
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        urgency === "Urgente" ? "text-red-700" : "text-gray-900"
                      }`}
                    >
                      Urgente
                    </h3>
                    <p className="text-sm text-gray-600">
                      Esta semana - Para necesidades inmediatas
                    </p>
                  </button>

                  {/* Normal */}
                  <button
                    type="button"
                    onClick={() => setUrgency("Normal")}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      urgency === "Normal"
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-3 rounded-lg ${
                          urgency === "Normal" ? "bg-blue-500" : "bg-blue-100"
                        }`}
                      >
                        <Clock
                          className={`h-6 w-6 ${
                            urgency === "Normal" ? "text-white" : "text-blue-600"
                          }`}
                        />
                      </div>
                      {urgency === "Normal" && (
                        <CheckCircle className="h-6 w-6 text-blue-600 ml-auto" />
                      )}
                    </div>
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        urgency === "Normal" ? "text-blue-700" : "text-gray-900"
                      }`}
                    >
                      Normal
                    </h3>
                    <p className="text-sm text-gray-600">
                      Siguiente semana - Entrega lunes
                    </p>
                  </button>

                  {/* Planeado */}
                  <button
                    type="button"
                    onClick={() => setUrgency("Planeado")}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                      urgency === "Planeado"
                        ? "border-green-500 bg-green-50 shadow-lg scale-105"
                        : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-3 rounded-lg ${
                          urgency === "Planeado" ? "bg-green-500" : "bg-green-100"
                        }`}
                      >
                        <Calendar
                          className={`h-6 w-6 ${
                            urgency === "Planeado" ? "text-white" : "text-green-600"
                          }`}
                        />
                      </div>
                      {urgency === "Planeado" && (
                        <CheckCircle className="h-6 w-6 text-green-600 ml-auto" />
                      )}
                    </div>
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        urgency === "Planeado" ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      Planeado
                    </h3>
                    <p className="text-sm text-gray-600">
                      1-2 semanas - Para planificación
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Work Info */}
            <div className="space-y-4 p-4 border-2 border-purple-200 rounded-lg">
              <h3 className="font-semibold text-lg text-purple-900">Información de Obra</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workCode">Código de Obra *</Label>
                  <Select 
                    value={workCode} 
                    onValueChange={setWorkCode}
                    disabled={userRole === "Residente"}
                  >
                    <SelectTrigger id="workCode">
                      <SelectValue placeholder="Seleccionar obra" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(worksDirectory)
                        .filter(code => userRole === "Compras" || code === userWorkCode)
                        .map((code) => (
                          <SelectItem key={code} value={code}>
                            {code} - {worksDirectory[code as keyof typeof worksDirectory].name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {workInfo && (
                  <>
                    <div className="space-y-2">
                      <Label>Nombre de Obra</Label>
                      <Input value={workInfo.name} disabled className="bg-purple-50" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Residente de Obra</Label>
                      <Input value={workInfo.resident} disabled className="bg-purple-50" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Delivery Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryNeededBy">Fecha Requerida en Obra *</Label>
                <Input
                  id="deliveryNeededBy"
                  type="date"
                  value={deliveryNeededBy}
                  onChange={(e) => setDeliveryNeededBy(e.target.value)}
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Materiales Solicitados</Label>
                <Button onClick={addItem} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Material
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Descripción del Material
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                          Cantidad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-40">
                          Unidad
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
                              placeholder="Ej: Cemento gris CPC 30R, Varilla 3/8, etc."
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
                            <Select
                              value={item.unit}
                              onValueChange={(value) => updateItem(item.id, "unit", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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

            {/* Comments Section */}
            <div className="space-y-4 p-4 border-2 border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Comunicación Obra ↔ Compras</h3>
              </div>
              
              {/* Comments List */}
              {comments.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg ${
                        comment.role === "Residente"
                          ? "bg-purple-50 ml-8"
                          : "bg-blue-50 mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.timestamp).toLocaleString("es-MX")}
                        </span>
                      </div>
                      <p className="text-sm">{comment.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribir comentario o instrucción especial..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addComment();
                    }
                  }}
                />
                <Button onClick={addComment} disabled={!newComment.trim()}>
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="bg-purple-600 hover:bg-purple-700">
            {editRequisition ? "Guardar Cambios" : "Crear Requisición"}
          </Button>
        </div>
      </div>
    </div>
  );
}