import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { ViewState } from "@/app/components/states";
import {
  MaterialRequisitionsStateLoading,
  MaterialRequisitionsStateError,
  MaterialRequisitionsStateEmpty,
} from "@/app/components/material-requisitions";
import {
  MaterialRequisitionForm,
  MaterialRequisition,
} from "./components/MaterialRequisitionForm";
import {
  Plus,
  MessageSquare,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileText,
  Send,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { worksDirectory } from "./utils/codeGenerators";

interface ResidentUser {
  name: string;
  initials: string;
  workCode: string;
  workName: string;
  password: string;
}

// Directorio de residentes con sus credenciales
const residents: ResidentUser[] = [
  {
    name: "Ing. Miguel Ángel Torres",
    initials: "MAT",
    workCode: "227",
    workName: "CASTELLO E",
    password: "mat2025",
  },
  {
    name: "Arq. Laura Martínez",
    initials: "LM",
    workCode: "228",
    workName: "CASTELLO F",
    password: "lm2025",
  },
  {
    name: "Ing. Roberto Sánchez",
    initials: "RS",
    workCode: "229",
    workName: "CASTELLO G",
    password: "rs2025",
  },
  {
    name: "Ing. Patricia Gómez",
    initials: "PG",
    workCode: "230",
    workName: "CASTELLO H",
    password: "pg2025",
  },
  {
    name: "Ing. Carlos Ramírez",
    initials: "CR",
    workCode: "231",
    workName: "DOZA A",
    password: "cr2025",
  },
  {
    name: "Arq. Sofia Vargas",
    initials: "SV",
    workCode: "232",
    workName: "BALVANERA",
    password: "sv2025",
  },
  {
    name: "Ing. Fernando López",
    initials: "FL",
    workCode: "233",
    workName: "DOZA C",
    password: "fl2025",
  },
];

// Mock data - En producción esto vendría de una base de datos
const initialRequisitions: MaterialRequisition[] = [
  {
    id: "1",
    requisitionNumber: "REQ227-001MAT",
    workCode: "227",
    workName: "CASTELLO E",
    residentName: "Ing. Miguel Ángel Torres",
    items: [
      {
        id: "1",
        description: "Cemento gris CPC 30R",
        quantity: 100,
        unit: "BULTO",
      },
      {
        id: "2",
        description: "Arena fina de río",
        quantity: 5,
        unit: "M3",
      },
    ],
    comments: [
      {
        id: "1",
        author: "Ing. Miguel Ángel Torres",
        role: "Residente",
        message: "Necesario para cimentación programada",
        timestamp: "2025-01-10T09:30:00",
      },
      {
        id: "2",
        author: "Departamento de Compras",
        role: "Compras",
        message: "Entendido, generando OC con CEMEX",
        timestamp: "2025-01-10T11:00:00",
      },
    ],
    status: "Convertida a OC",
    createdDate: "2025-01-10",
    urgency: "Urgente",
    deliveryNeededBy: "2025-01-17",
  },
  {
    id: "2",
    requisitionNumber: "REQ229-001RS",
    workCode: "229",
    workName: "CASTELLO G",
    residentName: "Ing. Roberto Sánchez",
    items: [
      {
        id: "1",
        description: "Piso porcelanato 60x60 cm",
        quantity: 150,
        unit: "M2",
      },
    ],
    comments: [
      {
        id: "1",
        author: "Ing. Roberto Sánchez",
        role: "Residente",
        message: "Verificar que sea el mismo tono que la muestra",
        timestamp: "2025-01-09T14:00:00",
      },
    ],
    status: "En Revisión",
    createdDate: "2025-01-09",
    urgency: "Normal",
    deliveryNeededBy: "2025-01-25",
  },
];

interface MaterialRequisitionsProps {
  initialState?: ViewState;
}

export default function MaterialRequisitions({ initialState = "data" }: MaterialRequisitionsProps = {}) {
  const [viewState, setViewState] = useState<ViewState>(initialState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentResident, setCurrentResident] = useState<ResidentUser | null>(null);
  const [selectedResidentName, setSelectedResidentName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(initialRequisitions);
  const [showForm, setShowForm] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<MaterialRequisition | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const resident = residents.find((r) => r.name === selectedResidentName);

    if (!resident) {
      setAuthError("Seleccione un residente");
      return;
    }

    if (password === resident.password) {
      setCurrentResident(resident);
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Contraseña incorrecta");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentResident(null);
    setPassword("");
    setSelectedResidentName("");
  };

  const handleSaveRequisition = (requisition: MaterialRequisition) => {
    const existingIndex = requisitions.findIndex((r) => r.id === requisition.id);
    if (existingIndex !== -1) {
      const updated = [...requisitions];
      updated[existingIndex] = requisition;
      setRequisitions(updated);
    } else {
      setRequisitions([...requisitions, requisition]);
    }
  };

  const handleAddComment = (requisitionId: string) => {
    if (!newComment.trim()) return;

    setRequisitions(
      requisitions.map((req) => {
        if (req.id === requisitionId) {
          return {
            ...req,
            comments: [
              ...req.comments,
              {
                id: `c${Date.now()}`,
                author: currentResident?.name || "",
                role: "Residente",
                message: newComment,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return req;
      })
    );
    setNewComment("");
  };

  const myRequisitions = requisitions.filter(
    (req) => req.workCode === currentResident?.workCode
  );

  const getStatusBadge = (status: MaterialRequisition["status"]) => {
    switch (status) {
      case "Pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "En Revisión":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            En Revisión
          </Badge>
        );
      case "Aprobada":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobada
          </Badge>
        );
      case "Convertida a OC":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Convertida a OC
          </Badge>
        );
      case "Rechazada":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rechazada
          </Badge>
        );
    }
  };

  const getUrgencyDisplay = (urgency: MaterialRequisition["urgency"]) => {
    switch (urgency) {
      case "Urgente":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <Zap className="h-5 w-5 fill-red-600" />
            <span className="font-semibold">Urgente</span>
          </div>
        );
      case "Normal":
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Normal</span>
          </div>
        );
      case "Planeado":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <Calendar className="h-5 w-5" />
            <span className="font-semibold">Planeado</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Handlers placeholder
  const handleCreateRequisition = () => {
    console.log("Crear nueva requisición");
    setShowForm(true);
  };

  const handleRetry = () => {
    console.log("Reintentar carga");
    setViewState("loading");
    setTimeout(() => setViewState("data"), 1000);
  };

  // ESTADO: LOADING
  if (viewState === "loading") {
    return <MaterialRequisitionsStateLoading />;
  }

  // ESTADO: ERROR
  if (viewState === "error") {
    return <MaterialRequisitionsStateError onRetry={handleRetry} />;
  }

  // ESTADO: EMPTY
  if (viewState === "empty") {
    return (
      <>
        <MaterialRequisitionsStateEmpty onCreateRequisition={handleCreateRequisition} />
        {showForm && (
          <MaterialRequisitionForm
            onClose={() => setShowForm(false)}
            onSave={(req) => {
              handleSaveRequisition(req);
              setViewState("data");
              // Auto-authenticate with the saved requisition's work resident
              const resident = residents.find((r) => r.workCode === req.workCode);
              if (resident) {
                setCurrentResident(resident);
                setIsAuthenticated(true);
              }
            }}
            userRole="Compras"
          />
        )}
      </>
    );
  }

  // ESTADO: DATA (contenido completo original)
  // Login Screen - Mobile Optimized
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-amber-700">
          <CardHeader className="bg-gradient-to-r from-amber-700 to-orange-700 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Acceso a Requisiciones</CardTitle>
                <p className="text-amber-100 text-sm mt-1">
                  Sistema de solicitud de materiales
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resident" className="text-base">Residente</Label>
                <select
                  id="resident"
                  value={selectedResidentName}
                  onChange={(e) => {
                    setSelectedResidentName(e.target.value);
                    setAuthError("");
                  }}
                  className="w-full px-4 py-3 border rounded-lg text-base"
                >
                  <option value="">Seleccionar...</option>
                  {residents.map((resident) => (
                    <option key={resident.workCode} value={resident.name}>
                      {resident.name} - {resident.workName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="Ingrese su contraseña"
                    className={`text-base py-3 pr-12 ${authError ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {authError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {authError}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 py-6 text-base"
              >
                <Unlock className="h-5 w-5 mr-2" />
                Acceder
              </Button>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800 font-medium mb-2">
                  Credenciales de prueba:
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  {residents.slice(0, 3).map((r) => (
                    <div key={r.workCode}>
                      • {r.initials}: <code className="bg-blue-100 px-1 rounded">{r.password}</code>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Interface - Mobile First
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Package className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Requisiciones</h1>
                <p className="text-sm text-amber-100 mt-1">
                  {currentResident?.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <Lock className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-amber-200">Obra</p>
              <p className="font-bold text-lg">{currentResident?.workCode}</p>
              <p className="text-xs text-amber-100 mt-1">{currentResident?.workName}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-amber-200">Requisiciones</p>
              <p className="font-bold text-3xl">{myRequisitions.length}</p>
            </div>
          </div>
        </div>

        {/* New Requisition Button - Floating Style */}
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 py-6 text-lg shadow-lg"
          size="lg"
        >
          <Plus className="h-6 w-6 mr-2" />
          Nueva Requisición
        </Button>

        {/* My Requisitions List - Mobile Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 px-1">Mis Requisiciones</h2>

          {myRequisitions.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                  <FileText className="h-10 w-10 text-amber-700" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No hay requisiciones
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Cree su primera requisición
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-amber-600 hover:bg-amber-700"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Crear Requisición
                </Button>
              </CardContent>
            </Card>
          ) : (
            myRequisitions.map((req) => (
              <Card
                key={req.id}
                className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-mono font-bold text-base mb-2">
                        {req.requisitionNumber}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(req.status)}
                      </div>
                    </div>
                  </div>

                  {/* Urgency - Visual */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Urgencia:</span>
                    {getUrgencyDisplay(req.urgency)}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creada:</span>
                      <span className="font-medium">
                        {new Date(req.createdDate).toLocaleDateString("es-MX")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entrega necesaria:</span>
                      <span className="font-medium">
                        {new Date(req.deliveryNeededBy).toLocaleDateString("es-MX")}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-sm text-amber-900 mb-2">
                      Materiales ({req.items.length})
                    </h4>
                    <div className="space-y-1">
                      {req.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-sm text-amber-800">
                          • {item.description} - {item.quantity} {item.unit}
                        </div>
                      ))}
                      {req.items.length > 2 && (
                        <div className="text-sm text-amber-700 font-medium">
                          +{req.items.length - 2} más...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-5 w-5 text-amber-700" />
                      <h4 className="font-semibold text-sm">
                        Mensajes ({req.comments.length})
                      </h4>
                    </div>

                    {req.comments.length > 0 && (
                      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                        {req.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className={`p-3 rounded-lg text-sm ${
                              comment.role === "Residente"
                                ? "bg-amber-50 border-l-4 border-l-amber-500"
                                : "bg-blue-50 border-l-4 border-l-blue-500"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-gray-700">
                                {comment.role === "Residente" ? "Tú" : "Compras"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleDateString("es-MX")}
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
                        value={selectedRequisition?.id === req.id ? newComment : ""}
                        onChange={(e) => {
                          setSelectedRequisition(req);
                          setNewComment(e.target.value);
                        }}
                        placeholder="Escribir mensaje..."
                        className="text-base"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(req.id);
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleAddComment(req.id)}
                        disabled={!newComment.trim()}
                        size="icon"
                        className="shrink-0 bg-amber-600 hover:bg-amber-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Requisition Form Modal */}
      {showForm && currentResident && (
        <MaterialRequisitionForm
          onClose={() => setShowForm(false)}
          onSave={handleSaveRequisition}
          userRole="Residente"
          userWorkCode={currentResident.workCode}
        />
      )}
    </div>
  );
}