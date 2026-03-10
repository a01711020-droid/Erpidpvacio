import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X } from "lucide-react";
import { obrasApi } from "@/app/utils/api";

export interface Work {
  code: string;
  name: string;
  client: string;
  contractNumber: string;
  contractAmount: number;
  advancePercentage: number;
  retentionPercentage: number;
  startDate: string;
  estimatedEndDate: string;
  resident: string;
  residentInitials: string;
  status: "Activa" | "Archivada";
  actualBalance?: number;
  totalEstimates?: number;
  totalExpenses?: number;
}

interface WorkFormProps {
  onClose: () => void;
  onSave?: (work: Work) => void;
  onSuccess?: () => void;
  editWork?: Work | null;
}

export function WorkForm({ onClose, onSave, onSuccess, editWork }: WorkFormProps) {
  const [code, setCode] = useState(editWork?.code || "");
  const [name, setName] = useState(editWork?.name || "");
  const [client, setClient] = useState(editWork?.client || "");
  const [contractNumber, setContractNumber] = useState(editWork?.contractNumber || "");
  const [contractAmount, setContractAmount] = useState(editWork?.contractAmount || 0);
  const [advancePercentage, setAdvancePercentage] = useState(editWork?.advancePercentage || 0);
  const [retentionPercentage, setRetentionPercentage] = useState(
    editWork?.retentionPercentage || 0
  );
  const [startDate, setStartDate] = useState(editWork?.startDate || "");
  const [estimatedEndDate, setEstimatedEndDate] = useState(editWork?.estimatedEndDate || "");
  const [resident, setResident] = useState(editWork?.resident || "");
  const [residentInitials, setResidentInitials] = useState(editWork?.residentInitials || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    const work: Work = {
      code,
      name,
      client,
      contractNumber,
      contractAmount,
      advancePercentage,
      retentionPercentage,
      startDate,
      estimatedEndDate,
      resident,
      residentInitials,
      status: editWork?.status || "Activa",
      actualBalance: editWork?.actualBalance || 0,
      totalEstimates: editWork?.totalEstimates || 0,
      totalExpenses: editWork?.totalExpenses || 0,
    };

    // Si hay callback onSave (modo legacy), usarlo
    if (onSave) {
      onSave(work);
      onClose();
      return;
    }

    // Si no, guardar en API
    setLoading(true);
    setError("");

    try {
      const obraData = {
        codigo_obra: code,
        nombre_obra: name,
        cliente: client,
        direccion: "", // No está en el form anterior pero lo dejamos vacío
        residente: resident,
        fecha_inicio: startDate,
        fecha_fin_estimada: estimatedEndDate,
        presupuesto_total: contractAmount,
        estado: "activa",
      };

      const response = await obrasApi.create(obraData);

      if (response.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.error || "Error al crear la obra");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error al crear obra:", err);
      setError("Error al crear la obra. Por favor intenta de nuevo.");
      setLoading(false);
    }
  };

  const isValid =
    code &&
    name &&
    client &&
    contractNumber &&
    contractAmount > 0 &&
    startDate &&
    estimatedEndDate &&
    resident &&
    residentInitials;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-indigo-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editWork ? "Editar Obra" : "Nueva Obra"}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Información general del proyecto de construcción
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-indigo-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de Obra (3 dígitos) *</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="227"
                    maxLength={3}
                    disabled={!!editWork}
                    className={editWork ? "bg-gray-100" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Este código es único e inmutable una vez creado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Obra *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="CASTELLO E"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Input
                    id="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Desarrolladora Inmobiliaria del Centro"
                  />
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Información del Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractNumber">Número de Contrato *</Label>
                  <Input
                    id="contractNumber"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    placeholder="CONT-2025-045"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractAmount">Monto del Contrato (MXN) *</Label>
                  <Input
                    id="contractAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={contractAmount}
                    onChange={(e) => setContractAmount(parseFloat(e.target.value) || 0)}
                    placeholder="5000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advancePercentage">Anticipo (%)</Label>
                  <Input
                    id="advancePercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={advancePercentage}
                    onChange={(e) => setAdvancePercentage(parseFloat(e.target.value) || 0)}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retentionPercentage">Fondo de Garantía (%)</Label>
                  <Input
                    id="retentionPercentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={retentionPercentage}
                    onChange={(e) => setRetentionPercentage(parseFloat(e.target.value) || 0)}
                    placeholder="5"
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Cronograma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedEndDate">Fecha Estimada de Término *</Label>
                  <Input
                    id="estimatedEndDate"
                    type="date"
                    value={estimatedEndDate}
                    onChange={(e) => setEstimatedEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Resident Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Residente de Obra</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resident">Nombre Completo del Residente *</Label>
                  <Input
                    id="resident"
                    value={resident}
                    onChange={(e) => setResident(e.target.value)}
                    placeholder="Ing. Miguel Ángel Torres"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residentInitials">Iniciales del Residente *</Label>
                  <Input
                    id="residentInitials"
                    value={residentInitials}
                    onChange={(e) => setResidentInitials(e.target.value.toUpperCase())}
                    placeholder="MAT"
                    maxLength={3}
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground">
                    Usadas para códigos de requisiciones
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-2">Resumen</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Código:</span>
                  <span className="ml-2 font-medium">{code || "---"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Monto:</span>
                  <span className="ml-2 font-medium">
                    ${contractAmount.toLocaleString("es-MX")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Anticipo:</span>
                  <span className="ml-2 font-medium">
                    ${((contractAmount * advancePercentage) / 100).toLocaleString("es-MX")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fondo:</span>
                  <span className="ml-2 font-medium">
                    ${((contractAmount * retentionPercentage) / 100).toLocaleString("es-MX")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid || loading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loading ? "Guardando..." : editWork ? "Guardar Cambios" : "Crear Obra"}
          </Button>
        </div>
      </div>
    </div>
  );
}