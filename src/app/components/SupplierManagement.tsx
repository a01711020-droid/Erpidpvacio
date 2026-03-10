import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
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
} from "lucide-react";

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
  isOpen: boolean;
  onClose: () => void;
}

export function SupplierManagement({ isOpen, onClose }: SupplierManagementProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      proveedor: "CEMEX",
      razonSocial: "CEMEX México S.A. de C.V.",
      rfc: "CMX850101ABC",
      direccion: "Av. Constitución 444, Monterrey, N.L.",
      vendedor: "Ing. Roberto Martínez",
      telefono: "(55) 5555-1234",
      correo: "roberto.martinez@cemex.com",
    },
    {
      id: "2",
      proveedor: "LEVINSON",
      razonSocial: "Aceros Levinson S.A. de C.V.",
      rfc: "ACL920315XYZ",
      direccion: "Calz. Vallejo 1020, CDMX",
      vendedor: "Ing. Carlos Pérez",
      telefono: "(55) 5555-3456",
      correo: "carlos.perez@levinson.com.mx",
    },
    {
      id: "3",
      proveedor: "HOME DEPOT",
      razonSocial: "Homer TLC, Inc.",
      rfc: "HTL030625MNO",
      direccion: "Periférico Sur 3720, CDMX",
      vendedor: "mostrador",
      telefono: "(55) 5555-7890",
      correo: "ventas@homedepot.com.mx",
    },
  ]);

  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
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
    setShowSupplierForm(true);
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
    setShowSupplierForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      setSuppliers(suppliers.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      // Actualizar proveedor existente
      setSuppliers(
        suppliers.map((s) =>
          s.id === editingSupplier.id
            ? { ...formData, id: editingSupplier.id }
            : s
        )
      );
    } else {
      // Agregar nuevo proveedor
      const newSupplier: Supplier = {
        ...formData,
        id: Date.now().toString(),
      };
      setSuppliers([...suppliers, newSupplier]);
    }

    setShowSupplierForm(false);
    setEditingSupplier(null);
  };

  return (
    <>
      {/* Main Dialog - Lista de Proveedores */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6 text-blue-600" />
              Gestión de Proveedores
            </DialogTitle>
            <DialogDescription>
              Administra la información de todos los proveedores registrados
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Botón Agregar Nuevo */}
            <div className="flex justify-end">
              <Button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Proveedor
              </Button>
            </div>

            {/* Tabla de Proveedores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Proveedores Registrados ({suppliers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Proveedor</TableHead>
                        <TableHead className="min-w-[200px]">Razón Social</TableHead>
                        <TableHead className="min-w-[120px]">RFC</TableHead>
                        <TableHead className="min-w-[180px]">Dirección</TableHead>
                        <TableHead className="min-w-[120px]">Vendedor</TableHead>
                        <TableHead className="min-w-[120px]">Teléfono</TableHead>
                        <TableHead className="min-w-[180px]">Correo</TableHead>
                        <TableHead className="text-center w-[100px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-semibold">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
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
                              <UserCircle className="h-3 w-3 text-gray-400" />
                              {supplier.vendedor}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {supplier.telefono}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-gray-400" />
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formulario de Proveedor (Agregar/Editar) */}
      <Dialog open={showSupplierForm} onOpenChange={setShowSupplierForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-blue-600" />
              {editingSupplier ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
            </DialogTitle>
            <DialogDescription>
              {editingSupplier 
                ? "Modifica la información del proveedor" 
                : "Completa los datos del nuevo proveedor"}
            </DialogDescription>
          </DialogHeader>

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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSupplierForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                {editingSupplier ? "Guardar Cambios" : "Agregar Proveedor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}