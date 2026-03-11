/**
 * SUPPLIER MANAGEMENT PAGE - Pantalla completa de Gestión de Proveedores
 * 
 * Pantalla dedicada con layout completo (no modal) para administrar proveedores
 * Incluye tabla amplia, formularios de creación/edición, y búsqueda
 */

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Building2,
  Phone,
  Mail,
  MapPin,
  UserCircle,
  FileText,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";
import { proveedoresEndpoint } from "@/app/utils/mockApiService";

export interface Supplier {
  id: string;
  proveedor: string;
  razonSocial: string;
  rfc: string;
  direccion: string;
  vendedor: string;
  telefono: string;
  correo: string;
}

interface SupplierManagementProps {
  onBack?: () => void;
  viewState?: "data" | "empty";
}

export default function SupplierManagement({ onBack, viewState = "data" }: SupplierManagementProps) {
  // Estado vacío - los proveedores se crean a través del formulario
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Cargar proveedores desde el mock API al montar
  useEffect(() => {
    proveedoresEndpoint.getAll().then((res) => {
      if (res.success) {
        setSuppliers(res.data as Supplier[]);
      }
    });
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Omit<Supplier, "id">>({
    proveedor: "",
    razonSocial: "",
    rfc: "",
    direccion: "",
    vendedor: "mostrador",
    telefono: "",
    correo: "",
  });

  const handleAddNew = () => {
    setEditingSupplier(null);
    setFormData({
      proveedor: "",
      razonSocial: "",
      rfc: "",
      direccion: "",
      vendedor: "mostrador",
      telefono: "",
      correo: "",
    });
    setShowForm(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      proveedor: supplier.proveedor,
      razonSocial: supplier.razonSocial,
      rfc: supplier.rfc,
      direccion: supplier.direccion,
      vendedor: supplier.vendedor,
      telefono: supplier.telefono,
      correo: supplier.correo,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      proveedoresEndpoint.delete(id).then((res) => {
        if (res.success) {
          setSuppliers(suppliers.filter((s) => s.id !== id));
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      // Actualizar proveedor existente
      proveedoresEndpoint.update(editingSupplier.id, formData).then((res) => {
        if (res.success) {
          setSuppliers(
            suppliers.map((s) =>
              s.id === editingSupplier.id ? { ...formData, id: editingSupplier.id } : s
            )
          );
        }
      });
    } else {
      // Agregar nuevo proveedor
      proveedoresEndpoint.create(formData).then((res) => {
        if (res.success && res.data) {
          setSuppliers([...suppliers, res.data as Supplier]);
        }
      });
    }

    setShowForm(false);
    setEditingSupplier(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  // Filtrar proveedores por búsqueda
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.rfc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Proveedores
                  </h1>
                  <p className="text-sm text-gray-500">
                    Administra la información de todos los proveedores registrados
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Proveedor
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Vista de Formulario */}
        {showForm ? (
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5 text-blue-600" />
                {editingSupplier ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre Corto del Proveedor */}
                <div className="space-y-2">
                  <Label htmlFor="proveedor">
                    Proveedor (Nombre Corto) *
                  </Label>
                  <Input
                    id="proveedor"
                    placeholder="Ej: CEMEX, LEVINSON, HOME DEPOT"
                    value={formData.proveedor}
                    onChange={(e) =>
                      setFormData({ ...formData, proveedor: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Razón Social */}
                <div className="space-y-2">
                  <Label htmlFor="razonSocial">
                    Razón Social *
                  </Label>
                  <Input
                    id="razonSocial"
                    placeholder="Ej: CEMEX México S.A. de C.V."
                    value={formData.razonSocial}
                    onChange={(e) =>
                      setFormData({ ...formData, razonSocial: e.target.value })
                    }
                    required
                  />
                </div>

                {/* RFC */}
                <div className="space-y-2">
                  <Label htmlFor="rfc">
                    RFC *
                  </Label>
                  <Input
                    id="rfc"
                    placeholder="Ej: CMX850101ABC"
                    value={formData.rfc}
                    onChange={(e) =>
                      setFormData({ ...formData, rfc: e.target.value.toUpperCase() })
                    }
                    className="font-mono"
                    required
                  />
                </div>

                {/* Dirección */}
                <div className="space-y-2">
                  <Label htmlFor="direccion">
                    Dirección *
                  </Label>
                  <Textarea
                    id="direccion"
                    placeholder="Ej: Av. Constitución 444, Monterrey, N.L."
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({ ...formData, direccion: e.target.value })
                    }
                    rows={2}
                    required
                  />
                </div>

                {/* Vendedor */}
                <div className="space-y-2">
                  <Label htmlFor="vendedor">
                    Vendedor
                  </Label>
                  <Input
                    id="vendedor"
                    placeholder="mostrador"
                    value={formData.vendedor}
                    onChange={(e) =>
                      setFormData({ ...formData, vendedor: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Por defecto: "mostrador" (puedes cambiarlo si hay un vendedor específico)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="telefono">
                      Teléfono *
                    </Label>
                    <Input
                      id="telefono"
                      placeholder="Ej: (55) 5555-1234"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Correo */}
                  <div className="space-y-2">
                    <Label htmlFor="correo">
                      Correo Electrónico *
                    </Label>
                    <Input
                      id="correo"
                      type="email"
                      placeholder="Ej: ventas@proveedor.com"
                      value={formData.correo}
                      onChange={(e) =>
                        setFormData({ ...formData, correo: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelForm}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <FileText className="h-4 w-4" />
                    {editingSupplier ? "Guardar Cambios" : "Agregar Proveedor"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Vista de Tabla */
          <div className="space-y-4">
            {/* Barra de búsqueda y estadísticas */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por proveedor, razón social o RFC..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span className="font-semibold">{filteredSuppliers.length}</span>
                    <span>proveedores</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Proveedores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Lista de Proveedores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[140px]">Proveedor</TableHead>
                        <TableHead className="min-w-[240px]">Razón Social</TableHead>
                        <TableHead className="min-w-[130px]">RFC</TableHead>
                        <TableHead className="min-w-[220px]">Dirección</TableHead>
                        <TableHead className="min-w-[160px]">Vendedor</TableHead>
                        <TableHead className="min-w-[140px]">Teléfono</TableHead>
                        <TableHead className="min-w-[220px]">Correo</TableHead>
                        <TableHead className="text-center w-[100px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                              <Search className="h-8 w-8" />
                              <p className="font-semibold">No se encontraron proveedores</p>
                              <p className="text-sm">
                                {searchTerm
                                  ? "Intenta con otros términos de búsqueda"
                                  : "Agrega tu primer proveedor para comenzar"}
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSuppliers.map((supplier) => (
                          <TableRow key={supplier.id}>
                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                {supplier.proveedor}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{supplier.razonSocial}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {supplier.rfc}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-start gap-1">
                                <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-2">{supplier.direccion}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <UserCircle className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                {supplier.vendedor}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                {supplier.telefono}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="line-clamp-1">{supplier.correo}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(supplier)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(supplier.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}