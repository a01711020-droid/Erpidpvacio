import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, AlertCircle, Users } from "lucide-react";

interface Destajista {
  id: string;
  nombre: string;
  iniciales: string;
  color: string;
  especialidad: string;
  telefono?: string;
}

interface Props {
  onBack: () => void;
  autoOpenForm?: boolean;
}

// 30 colores únicos para destajistas
const availableColors = [
  "#ef4444", "#dc2626", "#b91c1c", // Rojos
  "#f97316", "#ea580c", "#c2410c", // Naranjas
  "#f59e0b", "#d97706", "#b45309", // Amarillos/Ambar
  "#eab308", "#ca8a04", "#a16207", // Amarillos
  "#84cc16", "#65a30d", "#4d7c0f", // Lima
  "#22c55e", "#16a34a", "#15803d", // Verdes
  "#10b981", "#059669", "#047857", // Esmeralda
  "#14b8a6", "#0d9488", "#0f766e", // Teal
  "#06b6d4", "#0891b2", "#0e7490", // Cyan
  "#0ea5e9", "#0284c7", "#0369a1", // Azul cielo
  "#3b82f6", "#2563eb", "#1d4ed8", // Azul
  "#6366f1", "#4f46e5", "#4338ca", // Indigo
  "#8b5cf6", "#7c3aed", "#6d28d9", // Violeta
  "#a855f7", "#9333ea", "#7e22ce", // Púrpura
  "#d946ef", "#c026d3", "#a21caf", // Fucsia
  "#ec4899", "#db2777", "#be185d", // Rosa
  "#f43f5e", "#e11d48", "#be123c", // Rosa fuerte
];

const especialidades = [
  "Fierrero",
  "Bloquero",
  "Yesero",
  "Pintor",
  "Plomero",
  "Electricista",
  "Carpintero",
  "Herrero",
  "Azulejero",
  "Impermeabilizante",
  "Albañil General",
  "Excavación",
  "Cimbra",
  "Colado",
  "Acabados",
  "Instalaciones",
];

export default function DestajistasManagement({ onBack, autoOpenForm = false }: Props) {
  const [destajistas, setDestajistas] = useState<Destajista[]>([
    { id: "1", nombre: "Abraham Garcia", iniciales: "AG", color: "#b91c1c", especialidad: "Fierrero", telefono: "" },
    { id: "2", nombre: "Angel Rangel", iniciales: "AR", color: "#1e40af", especialidad: "Bloquero", telefono: "" },
    { id: "3", nombre: "Arturo Carmona", iniciales: "AC", color: "#15803d", especialidad: "Yesero", telefono: "" },
    { id: "4", nombre: "Bacilio Ortiz", iniciales: "BO", color: "#a21caf", especialidad: "Fierrero", telefono: "" },
    { id: "5", nombre: "Benito Garcia", iniciales: "BG", color: "#c2410c", especialidad: "Bloquero", telefono: "" },
    { id: "6", nombre: "Edwin Medina", iniciales: "EMR", color: "#0891b2", especialidad: "Instalaciones", telefono: "" },
    { id: "7", nombre: "Eleazar Leon", iniciales: "EL", color: "#4f46e5", especialidad: "Yesero", telefono: "" },
    { id: "8", nombre: "Emanuel Martinez", iniciales: "EM", color: "#be123c", especialidad: "Fierrero", telefono: "" },
    { id: "9", nombre: "Fabian Rodriguez", iniciales: "FR", color: "#0d9488", especialidad: "Bloquero", telefono: "" },
    { id: "10", nombre: "Facundo Bautista", iniciales: "FB", color: "#7c3aed", especialidad: "Yesero", telefono: "" },
    { id: "11", nombre: "Fernando Sanchez", iniciales: "FS", color: "#dc2626", especialidad: "Fierrero", telefono: "" },
    { id: "12", nombre: "Fidel Tinajero", iniciales: "FT", color: "#2563eb", especialidad: "Instalaciones", telefono: "" },
    { id: "13", nombre: "Francisco Martínez", iniciales: "FM", color: "#16a34a", especialidad: "Bloquero", telefono: "" },
    { id: "14", nombre: "Francisco Valencia", iniciales: "FV", color: "#9333ea", especialidad: "Yesero", telefono: "" },
    { id: "15", nombre: "IDP", iniciales: "IDP", color: "#334155", especialidad: "Albañil General", telefono: "" },
    { id: "16", nombre: "Juan Briones", iniciales: "JB", color: "#ea580c", especialidad: "Fierrero", telefono: "" },
    { id: "17", nombre: "Laura Juarez", iniciales: "LJ", color: "#0284c7", especialidad: "Acabados", telefono: "" },
    { id: "18", nombre: "Marco Angeles", iniciales: "MA", color: "#059669", especialidad: "Bloquero", telefono: "" },
    { id: "19", nombre: "Miguel Lopez", iniciales: "ML", color: "#7c2d12", especialidad: "Yesero", telefono: "" },
    { id: "20", nombre: "Octaviano Sandoval", iniciales: "OS", color: "#1e3a8a", especialidad: "Fierrero", telefono: "" },
    { id: "21", nombre: "Oscar Rizo", iniciales: "OR", color: "#14532d", especialidad: "Instalaciones", telefono: "" },
    { id: "22", nombre: "Oscar Suarez", iniciales: "OSU", color: "#86198f", especialidad: "Bloquero", telefono: "" },
    { id: "23", nombre: "Remedios Bautista", iniciales: "RB", color: "#be185d", especialidad: "Acabados", telefono: "" },
    { id: "24", nombre: "Roberto Flores", iniciales: "RF", color: "#0369a1", especialidad: "Yesero", telefono: "" },
    { id: "25", nombre: "Roberto Ortiz Sanchez", iniciales: "RO", color: "#047857", especialidad: "Fierrero", telefono: "" },
    { id: "26", nombre: "Roberto Reyes", iniciales: "RR", color: "#b45309", especialidad: "Bloquero", telefono: "" },
    { id: "27", nombre: "Samuel Chico", iniciales: "SC", color: "#6366f1", especialidad: "Instalaciones", telefono: "" },
    { id: "28", nombre: "Severo Luciano", iniciales: "SL", color: "#ca8a04", especialidad: "Yesero", telefono: "" },
    { id: "29", nombre: "Benjamin Juarez", iniciales: "BJ", color: "#0e7490", especialidad: "Fierrero", telefono: "" },
    { id: "30", nombre: "Ricardo de Alba", iniciales: "RA", color: "#991b1b", especialidad: "Bloquero", telefono: "" },
    { id: "31", nombre: "Ronaldo Martinez", iniciales: "RM", color: "#166534", especialidad: "Acabados", telefono: "" },
    { id: "32", nombre: "Isidro Garcia", iniciales: "IG", color: "#7e22ce", especialidad: "Yesero", telefono: "" },
  ]);

  // Form states — if autoOpenForm, start open
  const [showForm, setShowForm] = useState(autoOpenForm);
  const [destajistaName, setDestajistaName] = useState("");
  const [destajistaIniciales, setDestajistaIniciales] = useState("");
  const [destajistaColor, setDestajistaColor] = useState("");
  const [destajistaEspecialidad, setDestajistaEspecialidad] = useState("");
  const [destajistaTelefono, setDestajistaTelefono] = useState("");
  const [inicialesConflict, setInicialesConflict] = useState(false);
  const [manualIniciales, setManualIniciales] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true);
    setDestajistaName("");
    setDestajistaIniciales("");
    setDestajistaEspecialidad("");
    setDestajistaColor(
      availableColors.find((c) => !destajistas.some((d) => d.color === c)) ||
        availableColors[0]
    );
    setInicialesConflict(false);
    setManualIniciales(false);
  };

  const handleNameChange = (name: string) => {
    setDestajistaName(name);
    if (!manualIniciales && name) {
      const words = name.trim().split(" ");
      const auto = words.map((w) => w[0]?.toUpperCase() || "").join("");
      setDestajistaIniciales(auto);

      const conflict = destajistas.some((d) => d.iniciales === auto);
      setInicialesConflict(conflict);
    }
  };

  const handleInicialesChange = (iniciales: string) => {
    setDestajistaIniciales(iniciales.toUpperCase());
    setManualIniciales(true);

    const conflict = destajistas.some(
      (d) => d.iniciales === iniciales.toUpperCase()
    );
    setInicialesConflict(conflict);
  };

  const handleSave = () => {
    if (!destajistaName || !destajistaIniciales || !destajistaEspecialidad || inicialesConflict) return;

    const newDestajista: Destajista = {
      id: Date.now().toString(),
      nombre: destajistaName,
      iniciales: destajistaIniciales,
      color: destajistaColor,
      especialidad: destajistaEspecialidad,
      telefono: destajistaTelefono,
    };

    setDestajistas([...destajistas, newDestajista]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setDestajistas(destajistas.filter((d) => d.id !== id));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom right, #ebe8e3 0%, #f5f3f0 50%, #ebe8e3 100%)",
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 border-b-4 border-teal-600 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </Button>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Gestión de Destajistas
                </h1>
                <p className="text-teal-100 text-lg">
                  Administra los destajistas y sus identificadores únicos
                </p>
              </div>
            </div>
            <Button
              onClick={handleOpenForm}
              className="bg-white text-teal-800 hover:bg-teal-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Destajista
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Destajistas Activos
            </h2>
            <p className="text-gray-600">
              Total de {destajistas.length} destajista
              {destajistas.length !== 1 ? "s" : ""} registrado
              {destajistas.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {destajistas.map((destajista) => (
              <Card
                key={destajista.id}
                className="p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ backgroundColor: destajista.color }}
                  >
                    {destajista.iniciales}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(destajista.id)}
                    className="hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">
                    {destajista.nombre}
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Iniciales: <span className="font-semibold">{destajista.iniciales}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Especialidad: <span className="font-semibold">{destajista.especialidad}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: destajista.color }}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {destajista.color}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {destajistas.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No hay destajistas registrados
              </p>
              <Button onClick={handleOpenForm} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Destajista
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Destajista</DialogTitle>
            <DialogDescription>
              Ingresa los datos del destajista. Las iniciales se generan
              automáticamente y NO pueden repetirse.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={destajistaName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="iniciales">Iniciales (Únicas)</Label>
              <div className="flex gap-2">
                <Input
                  id="iniciales"
                  value={destajistaIniciales}
                  onChange={(e) => handleInicialesChange(e.target.value)}
                  placeholder="Ej: JP"
                  maxLength={4}
                  className={inicialesConflict ? "border-red-500" : ""}
                />
                {destajistaIniciales && (
                  <div
                    className="w-12 h-10 rounded flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: destajistaColor }}
                  >
                    {destajistaIniciales}
                  </div>
                )}
              </div>
              {inicialesConflict && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Ya existe un destajista con estas iniciales</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidad">Especialidad</Label>
              <Select value={destajistaEspecialidad} onValueChange={setDestajistaEspecialidad}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color Identificador (Único)</Label>
              <div className="flex gap-2 flex-wrap">
                {availableColors.map((color) => {
                  const inUse = destajistas.some((d) => d.color === color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => !inUse && setDestajistaColor(color)}
                      className={`w-10 h-10 rounded relative ${
                        destajistaColor === color
                          ? "ring-2 ring-gray-900 ring-offset-2"
                          : ""
                      } ${inUse ? "opacity-40 cursor-not-allowed" : ""}`}
                      style={{ backgroundColor: color }}
                      disabled={inUse}
                      title={inUse ? "Color en uso" : "Disponible"}
                    >
                      {inUse && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                {availableColors.filter((c) => !destajistas.some((d) => d.color === c)).length} colores disponibles de 30
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={destajistaTelefono}
                onChange={(e) => setDestajistaTelefono(e.target.value)}
                placeholder="Ej: 123-456-7890"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !destajistaName || !destajistaIniciales || !destajistaEspecialidad || inicialesConflict
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}