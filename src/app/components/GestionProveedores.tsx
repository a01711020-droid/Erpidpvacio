/**
 * GESTIÓN DE PROVEEDORES
 * 
 * Componente PURO - Solo visual
 * Catálogo completo de proveedores con:
 * - Lista de proveedores con búsqueda y filtros
 * - Formulario de creación/edición
 * - Autenticación por contraseña (12345)
 * - Tres estados visuales: Loading, Empty, WithData
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Lock,
  ShieldCheck,
  Users,
  AlertCircle,
  FileText,
  DollarSign,
} from "lucide-react";

// ============================================================================
// TIPOS - Basados en spec/proveedores/proveedor.schema.json
// ============================================================================

interface Proveedor {
  proveedor_id: string;
  nombre_comercial: string;
  razon_social: string;
  rfc: string;
  direccion: string | null;
  ciudad: string | null;
  codigo_postal: string | null;
  telefono: string | null;
  email: string | null;
  contacto_principal: string | null;
  banco: string | null;
  numero_cuenta: string | null;
  clabe: string | null;
  tipo_proveedor: "material" | "servicio" | "renta" | "mixto" | null;
  dias_credito: number;
  limite_credito: number;
  activo: boolean;
}

// ============================================================================
// PROPS
// ============================================================================

interface GestionProveedoresProps {
  isLoading?: boolean;
  proveedores?: Proveedor[];
  onCrearProveedor?: (proveedor: Partial<Proveedor>) => void;
  onEditarProveedor?: (id: string, proveedor: Partial<Proveedor>) => void;
  onEliminarProveedor?: (id: string) => void;
}

// ============================================================================
// ESTADO 1: LOADING
// ============================================================================

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// ESTADO 2: EMPTY
// ============================================================================

function EmptyState({ onAbrirFormulario }: { onAbrirFormulario: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No hay proveedores registrados
          </h2>
          
          <p className="text-gray-600 mb-6">
            Comienza agregando tu primer proveedor para poder crear órdenes de compra
            y gestionar pagos en el sistema.
          </p>
          
          <Button 
            onClick={onAbrirFormulario}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Agregar Primer Proveedor
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            CEMEX, LEVINSON, HOME DEPOT, etc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MODAL DE AUTENTICACIÓN
// ============================================================================

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

function AuthDialog({ open, onClose, onAuthenticated }: AuthDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setError("");
    
    // Mock authentication
    setTimeout(() => {
      if (password === "12345") {
        onAuthenticated();
        setPassword("");
        setError("");
      } else {
        setError("Contraseña incorrecta");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl">
            Autenticación Requerida
          </DialogTitle>
          <DialogDescription className="text-center">
            Ingresa la contraseña para acceder a la gestión de proveedores.
            Esta área está protegida para usuarios autorizados.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="pl-10"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !password}>
            {isLoading ? "Verificando..." : "Autenticar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// FORMULARIO DE PROVEEDOR
// ============================================================================

interface ProveedorFormProps {
  open: boolean;
  onClose: () => void;
  proveedor?: Proveedor | null;
  onGuardar: (proveedor: Partial<Proveedor>) => void;
}

function ProveedorForm({ open, onClose, proveedor, onGuardar }: ProveedorFormProps) {
  const [formData, setFormData] = useState<Partial<Proveedor>>(
    proveedor || {
      nombre_comercial: "",
      razon_social: "",
      rfc: "",
      direccion: "",
      ciudad: "",
      codigo_postal: "",
      telefono: "",
      email: "",
      contacto_principal: "",
      banco: "",
      numero_cuenta: "",
      clabe: "",
      tipo_proveedor: null,
      dias_credito: 0,
      limite_credito: 0,
      activo: true,
    }
  );

  const handleChange = (field: keyof Proveedor, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onGuardar(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
          <DialogDescription>
            {proveedor 
              ? "Modifica la información del proveedor existente"
              : "Completa la información del nuevo proveedor"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información General */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_comercial">
                  Nombre Comercial <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre_comercial"
                  placeholder="CEMEX, LEVINSON, etc."
                  value={formData.nombre_comercial}
                  onChange={(e) => handleChange("nombre_comercial", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_proveedor">Tipo de Proveedor</Label>
                <Select
                  value={formData.tipo_proveedor || ""}
                  onValueChange={(value) => handleChange("tipo_proveedor", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="servicio">Servicio</SelectItem>
                    <SelectItem value="renta">Renta</SelectItem>
                    <SelectItem value="mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="razon_social">
                  Razón Social <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="razon_social"
                  placeholder="Razón social completa"
                  value={formData.razon_social}
                  onChange={(e) => handleChange("razon_social", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfc">
                  RFC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rfc"
                  placeholder="XAXX010101000"
                  maxLength={13}
                  value={formData.rfc}
                  onChange={(e) => handleChange("rfc", e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contacto_principal">Contacto Principal</Label>
                <Input
                  id="contacto_principal"
                  placeholder="Nombre del contacto"
                  value={formData.contacto_principal || ""}
                  onChange={(e) => handleChange("contacto_principal", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  placeholder="55-5555-5555"
                  value={formData.telefono || ""}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@proveedor.com"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Dirección
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input
                  id="direccion"
                  placeholder="Calle, número, colonia"
                  value={formData.direccion || ""}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Input
                  id="ciudad"
                  placeholder="Ciudad de México"
                  value={formData.ciudad || ""}
                  onChange={(e) => handleChange("ciudad", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo_postal">Código Postal</Label>
                <Input
                  id="codigo_postal"
                  placeholder="01000"
                  maxLength={5}
                  value={formData.codigo_postal || ""}
                  onChange={(e) => handleChange("codigo_postal", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Información Bancaria */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Información Bancaria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banco">Banco</Label>
                <Input
                  id="banco"
                  placeholder="BBVA, Santander, etc."
                  value={formData.banco || ""}
                  onChange={(e) => handleChange("banco", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_cuenta">Número de Cuenta</Label>
                <Input
                  id="numero_cuenta"
                  placeholder="0123456789"
                  value={formData.numero_cuenta || ""}
                  onChange={(e) => handleChange("numero_cuenta", e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clabe">CLABE Interbancaria</Label>
                <Input
                  id="clabe"
                  placeholder="012180001234567890 (18 dígitos)"
                  maxLength={18}
                  value={formData.clabe || ""}
                  onChange={(e) => handleChange("clabe", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Crédito */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Condiciones de Crédito
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dias_credito">Días de Crédito</Label>
                <Input
                  id="dias_credito"
                  type="number"
                  min="0"
                  placeholder="0, 15, 30, etc."
                  value={formData.dias_credito}
                  onChange={(e) => handleChange("dias_credito", parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500">0 = Sin crédito (pago de contado)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limite_credito">Límite de Crédito</Label>
                <Input
                  id="limite_credito"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.limite_credito}
                  onChange={(e) => handleChange("limite_credito", parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500">Monto máximo de crédito permitido</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {proveedor ? "Guardar Cambios" : "Crear Proveedor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// TARJETA DE PROVEEDOR
// ============================================================================

interface ProveedorCardProps {
  proveedor: Proveedor;
  onEditar: () => void;
  onEliminar: () => void;
}

function ProveedorCard({ proveedor, onEditar, onEliminar }: ProveedorCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{proveedor.nombre_comercial}</CardTitle>
              {proveedor.activo ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Activo
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <XCircle className="h-3 w-3 mr-1" />
                  Inactivo
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{proveedor.razon_social}</p>
            <p className="text-xs text-gray-500 font-mono mt-1">RFC: {proveedor.rfc}</p>
          </div>
          {proveedor.tipo_proveedor && (
            <Badge variant="outline" className="capitalize">
              {proveedor.tipo_proveedor}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información de Contacto */}
        <div className="space-y-2">
          {proveedor.contacto_principal && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{proveedor.contacto_principal}</span>
            </div>
          )}
          {proveedor.telefono && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{proveedor.telefono}</span>
            </div>
          )}
          {proveedor.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700 truncate">{proveedor.email}</span>
            </div>
          )}
          {proveedor.ciudad && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{proveedor.ciudad}</span>
            </div>
          )}
        </div>

        {/* Condiciones de Crédito */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Días de Crédito:</span>
            <span className="font-semibold text-gray-900">
              {proveedor.dias_credito === 0 ? "Contado" : `${proveedor.dias_credito} días`}
            </span>
          </div>
          {proveedor.limite_credito > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Límite de Crédito:</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(proveedor.limite_credito)}
              </span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={onEditar}
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onEliminar}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL - ESTADO 3: WITH DATA
// ============================================================================

export default function GestionProveedores({
  isLoading = false,
  proveedores = [],
  onCrearProveedor,
  onEditarProveedor,
  onEliminarProveedor,
}: GestionProveedoresProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProveedorForm, setShowProveedorForm] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");

  // Autenticación
  const handleAbrirGestion = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      setShowProveedorForm(true);
    }
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setShowAuthDialog(false);
    setShowProveedorForm(true);
  };

  // CRUD
  const handleCrear = () => {
    setProveedorEditando(null);
    handleAbrirGestion();
  };

  const handleEditar = (proveedor: Proveedor) => {
    setProveedorEditando(proveedor);
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      setShowProveedorForm(true);
    }
  };

  const handleGuardar = (proveedor: Partial<Proveedor>) => {
    if (proveedorEditando) {
      onEditarProveedor?.(proveedorEditando.proveedor_id, proveedor);
    } else {
      onCrearProveedor?.(proveedor);
    }
    setShowProveedorForm(false);
    setProveedorEditando(null);
  };

  // Filtrado
  const proveedoresFiltrados = proveedores.filter((p) => {
    const matchSearch = 
      p.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.rfc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTipo = filterTipo === "todos" || p.tipo_proveedor === filterTipo;
    
    return matchSearch && matchTipo;
  });

  // Estado 1: Loading
  if (isLoading) {
    return <LoadingState />;
  }

  // Estado 2: Empty
  if (!proveedores || proveedores.length === 0) {
    return (
      <>
        <EmptyState onAbrirFormulario={handleCrear} />
        <AuthDialog
          open={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onAuthenticated={handleAuthenticated}
        />
        <ProveedorForm
          open={showProveedorForm}
          onClose={() => {
            setShowProveedorForm(false);
            setProveedorEditando(null);
          }}
          proveedor={proveedorEditando}
          onGuardar={handleGuardar}
        />
      </>
    );
  }

  // Estado 3: With Data
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Catálogo de Proveedores
          </h1>
          <p className="text-gray-600 mt-1">
            {proveedores.length} {proveedores.length === 1 ? "proveedor registrado" : "proveedores registrados"}
          </p>
        </div>
        <Button onClick={handleCrear} size="lg" className="gap-2 shadow-lg">
          <Plus className="h-5 w-5" />
          Agregar Proveedor
        </Button>
      </div>

      {/* Búsqueda y Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, razón social o RFC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="servicio">Servicio</SelectItem>
                <SelectItem value="renta">Renta</SelectItem>
                <SelectItem value="mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {proveedoresFiltrados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No se encontraron proveedores que coincidan con los filtros
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proveedoresFiltrados.map((proveedor) => (
            <ProveedorCard
              key={proveedor.proveedor_id}
              proveedor={proveedor}
              onEditar={() => handleEditar(proveedor)}
              onEliminar={() => onEliminarProveedor?.(proveedor.proveedor_id)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AuthDialog
        open={showAuthDialog}
        onClose={() => {
          setShowAuthDialog(false);
          setProveedorEditando(null);
        }}
        onAuthenticated={handleAuthenticated}
      />
      <ProveedorForm
        open={showProveedorForm}
        onClose={() => {
          setShowProveedorForm(false);
          setProveedorEditando(null);
        }}
        proveedor={proveedorEditando}
        onGuardar={handleGuardar}
      />
    </div>
  );
}