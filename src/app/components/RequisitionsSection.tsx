import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  MaterialRequisition,
} from "./MaterialRequisitionForm";
import {
  Search,
  Filter,
  MessageSquare,
  Send,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Calendar,
  Package,
  ArrowRight,
  Eye,
  Copy,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface RequisitionsSectionProps {
  requisitions: MaterialRequisition[];
  onUpdateRequisition: (requisition: MaterialRequisition) => void;
  onConvertToOC: (requisition: MaterialRequisition) => void;
}

export function RequisitionsSection({
  requisitions,
  onUpdateRequisition,
  onConvertToOC,
}: RequisitionsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Activas");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("Todos");
  const [selectedRequisition, setSelectedRequisition] = useState<MaterialRequisition | null>(null);
  const [newComment, setNewComment] = useState("");

  const filteredRequisitions = requisitions.filter((req) => {
    // Shadowban: Por defecto ocultar las "Compradas", solo aparecen si se buscan o si el filtro es "Comprado" o "Todos"
    const isArchived = req.status === "Comprado";
    const hasSearch = searchTerm.trim() !== "";
    const showingArchived = statusFilter === "Comprado" || statusFilter === "Todos";
    
    if (isArchived && !hasSearch && !showingArchived) {
      return false; // Shadowban activo
    }

    const matchesSearch =
      req.requisitionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.residentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos" || statusFilter === "Activas" && req.status === "En Revisión" || req.status === statusFilter;
    const matchesUrgency =
      urgencyFilter === "Todos" || req.urgency === urgencyFilter;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedRequisition) return;

    const updatedRequisition = {
      ...selectedRequisition,
      comments: [
        ...selectedRequisition.comments,
        {
          id: `c${Date.now()}`,
          author: "Departamento de Compras",
          role: "Compras" as const,
          message: newComment,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    onUpdateRequisition(updatedRequisition);
    setSelectedRequisition(updatedRequisition);
    setNewComment("");
  };

  const handleChangeStatus = (status: MaterialRequisition["status"]) => {
    if (!selectedRequisition) return;
    const updatedRequisition = { ...selectedRequisition, status };
    onUpdateRequisition(updatedRequisition);
    setSelectedRequisition(updatedRequisition);
  };

  const getStatusBadge = (status: MaterialRequisition["status"]) => {
    switch (status) {
      case "En Revisión":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            En Revisión
          </Badge>
        );
      case "Comprado":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Comprado
          </Badge>
        );
    }
  };

  const getUrgencyDisplay = (urgency: MaterialRequisition["urgency"]) => {
    switch (urgency) {
      case "Urgente":
        return (
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 fill-red-600 text-red-600" />
            <span className="font-semibold text-red-600 text-sm">Urgente</span>
          </div>
        );
      case "Normal":
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-600 text-sm">Normal</span>
          </div>
        );
      case "Planeado":
        return (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600 text-sm">Planeado</span>
          </div>
        );
    }
  };

  // Statistics - Solo para requisiciones activas (no "Compradas")
  const inReviewCount = requisitions.filter((r) => r.status === "En Revisión").length;
  const urgentCount = requisitions.filter(
    (r) => r.urgency === "Urgente" && r.status !== "Comprado"
  ).length;
  const purchasedCount = requisitions.filter((r) => r.status === "Comprado").length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">En Revisión</p>
                <p className="text-3xl font-bold text-blue-600">{inReviewCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Urgentes</p>
                <p className="text-3xl font-bold text-red-600">{urgentCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Compradas</p>
                <p className="text-3xl font-bold text-green-600">{purchasedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por número, obra o residente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activas">Activas (En Revisión)</SelectItem>
                <SelectItem value="En Revisión">En Revisión</SelectItem>
                <SelectItem value="Comprado">Comprado</SelectItem>
                <SelectItem value="Todos">Todos los estados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas las urgencias</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Planeado">Planeado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requisitions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequisitions.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron requisiciones</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequisitions.map((req) => (
            <Card
              key={req.id}
              className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Main Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-mono font-bold text-lg mb-2">
                          {req.requisitionNumber}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {getStatusBadge(req.status)}
                          {getUrgencyDisplay(req.urgency)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Obra</p>
                        <p className="font-medium">
                          {req.workCode} - {req.workName}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Residente</p>
                        <p className="font-medium">{req.residentName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fecha creación</p>
                        <p className="font-medium">
                          {new Date(req.createdDate).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Entrega necesaria</p>
                        <p className="font-medium">
                          {new Date(req.deliveryNeededBy).toLocaleDateString("es-MX")}
                        </p>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-blue-900 mb-2">
                        Materiales ({req.items.length})
                      </h4>
                      <div className="space-y-1">
                        {req.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-sm text-blue-800">
                            • {item.description} - {item.quantity} {item.unit}
                          </div>
                        ))}
                        {req.items.length > 2 && (
                          <div className="text-sm text-blue-600 font-medium">
                            +{req.items.length - 2} más...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Comments Count */}
                    {req.comments.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{req.comments.length} mensaje(s)</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequisition(req)}
                      className="flex-1 md:flex-none"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </Button>
                    {req.status === "Aprobada" && (
                      <Button
                        size="sm"
                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                        onClick={() => onConvertToOC(req)}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Convertir a OC
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedRequisition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Detalle de Requisición
                </h2>
                <p className="text-blue-100 text-sm">
                  {selectedRequisition.requisitionNumber}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedRequisition(null)}
                className="text-white hover:bg-blue-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status and Urgency */}
              <div className="flex items-center gap-4">
                {getStatusBadge(selectedRequisition.status)}
                {getUrgencyDisplay(selectedRequisition.urgency)}
              </div>

              {/* Work and Resident Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">
                    Información de Obra
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Código:</span>
                      <p className="font-medium">{selectedRequisition.workCode}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Obra:</span>
                      <p className="font-medium">{selectedRequisition.workName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-semibold text-slate-900">
                    Información del Residente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{selectedRequisition.residentName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fecha creación:</span>
                      <p className="font-medium">
                        {new Date(selectedRequisition.createdDate).toLocaleDateString(
                          "es-MX"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Date */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Entrega necesaria para:
                </p>
                <p className="text-lg font-bold">
                  {new Date(selectedRequisition.deliveryNeededBy).toLocaleDateString(
                    "es-MX"
                  )}
                </p>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Materiales Solicitados</h3>
                <table className="w-full border rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm">Descripción</th>
                      <th className="px-4 py-2 text-left text-sm">Cantidad</th>
                      <th className="px-4 py-2 text-left text-sm">Unidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedRequisition.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm">{item.description}</td>
                        <td className="px-4 py-2 text-sm font-medium">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comments */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comunicación Residente - Compras
                </h3>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {selectedRequisition.comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay mensajes aún
                    </p>
                  ) : (
                    selectedRequisition.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-lg ${
                          comment.role === "Residente"
                            ? "bg-blue-50 border-l-4 border-l-blue-400"
                            : "bg-blue-50 border-l-4 border-l-blue-500"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleDateString("es-MX")}{" "}
                            {new Date(comment.timestamp).toLocaleTimeString("es-MX", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribir mensaje al residente..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </div>
              </div>

              {/* Change Status */}
              <div>
                <h3 className="font-semibold mb-3">Cambiar Estado</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangeStatus("En Revisión")}
                    disabled={selectedRequisition.status === "En Revisión"}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    En Revisión
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleChangeStatus("Comprado")}
                    disabled={selectedRequisition.status === "Comprado"}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Comprado
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedRequisition(null)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    onConvertToOC(selectedRequisition);
                    setSelectedRequisition(null);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Materiales a OC
                </Button>
                {selectedRequisition.status === "Aprobada" && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      onConvertToOC(selectedRequisition);
                      setSelectedRequisition(null);
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Convertir a Orden de Compra
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}