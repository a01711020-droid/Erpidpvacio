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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export interface EstimationFormData {
  movementNumber: number;
  type: "estimacion" | "aditiva" | "deductiva";
  date: string;
  description: string;
  amount: number;
  advanceAmortization: number;
  guaranteeFund: number;
  paid: number;
  balanceToPay: number;
}

interface EstimationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EstimationFormData) => void;
  contractInfo: {
    contractAmount: number;
    advancePercentage: number;
    guaranteeFundPercentage: number;
  };
  lastEstimation?: {
    no: number;
    advanceBalance: number;
    contractPending: number;
    contractAmountCurrent: number;
  };
}

export function EstimationForm({
  isOpen,
  onClose,
  onSave,
  contractInfo,
  lastEstimation,
}: EstimationFormProps) {
  const [formData, setFormData] = useState<EstimationFormData>({
    movementNumber: (lastEstimation?.no || 0) + 1,
    type: "estimacion",
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    advanceAmortization: 0,
    guaranteeFund: 0,
    paid: 0,
    balanceToPay: 0,
  });

  // ====================================================================
  // LÓGICA DE CÁLCULO CORREGIDA
  // ====================================================================
  // IMPORTANTE: Esta lógica debe considerar:
  // 1. El saldo de anticipo disponible (no amortizar más de lo que queda)
  // 2. Las aditivas/deductivas modifican el contractPending Y el contractAmountCurrent
  // 3. El fondo de garantía se calcula sobre el importe y está CAPEADO al 3% del contrato ($30,000)
  // 4. El campo "Pagado" es editable por el usuario
  // 5. Saldo por Pagar = Neto - Pagado
  // 6. NUEVA FÓRMULA DE AMORTIZACIÓN PROPORCIONAL:
  //    advanceAmortization = (Monto estimación / Contrato vigente actual) × Anticipo total
  //    Esta fórmula garantiza que el anticipo se amortice proporcionalmente al avance
  //    sobre el contrato vigente (que puede cambiar con aditivas/deductivas)
  // ====================================================================
  const calculateValues = (amount: number, type: "estimacion" | "aditiva" | "deductiva", paid: number = 0) => {
    // Para aditivas y deductivas NO se calcula amortización ni fondo de garantía
    if (type === "aditiva" || type === "deductiva") {
      return {
        advanceAmortization: 0,
        guaranteeFund: 0,
        balanceToPay: 0,
      };
    }

    // Para estimaciones:
    // 1. Calcular amortización de anticipo con NUEVA FÓRMULA PROPORCIONAL
    // contractAmountCurrent puede haber cambiado si hubo aditivas/deductivas
    const contractAmountCurrent = lastEstimation?.contractAmountCurrent || contractInfo.contractAmount;
    const advanceTotal = (contractInfo.contractAmount * contractInfo.advancePercentage) / 100;
    
    // FÓRMULA PROPORCIONAL: (Monto estimación / Contrato vigente) × Anticipo total
    const calculatedAmortization = (amount / contractAmountCurrent) * advanceTotal;
    
    // VALIDACIÓN: No amortizar más del saldo de anticipo disponible
    const availableAdvanceBalance = lastEstimation?.advanceBalance || 0;
    const advanceAmortization = Math.min(calculatedAmortization, availableAdvanceBalance);
    
    // 2. Calcular fondo de garantía con CAP
    // IMPORTANTE: El fondo de garantía está CAPEADO al 3% del monto del contrato
    const guaranteeFundCap = (contractInfo.contractAmount * contractInfo.guaranteeFundPercentage) / 100; // $30,000 para contrato de $1M
    const guaranteeFundCalculated = (amount * contractInfo.guaranteeFundPercentage) / 100;
    
    // TODO: En producción, necesitamos saber cuánto se ha retenido acumulado
    // Para este ejemplo, asumimos que aún no se ha alcanzado el cap
    const guaranteeFund = Math.min(guaranteeFundCalculated, guaranteeFundCap);
    
    // 3. Calcular NETO (lo que se debe pagar después de deducciones)
    const netAmount = amount - advanceAmortization - guaranteeFund;
    
    // 4. Calcular SALDO POR PAGAR (Neto - Lo que ya se pagó)
    const balanceToPay = netAmount - paid;
    
    return {
      advanceAmortization,
      guaranteeFund,
      balanceToPay,
    };
  };

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    const calculated = calculateValues(amount, formData.type, 0); // paid siempre es 0 al crear
    
    setFormData({
      ...formData,
      amount,
      ...calculated,
    });
  };

  const handlePaidChange = (value: string) => {
    const paid = parseFloat(value) || 0;
    const calculated = calculateValues(formData.amount, formData.type, paid);
    
    setFormData({
      ...formData,
      paid,
      ...calculated,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Contar cuántos movimientos del mismo tipo ya existen para determinar el número
    // En producción esto vendría del backend
    const typeLabel = getTypeLabel();
    const typeNumber = formData.movementNumber;
    
    // Generar la descripción formateada con el prefijo automático
    // Si el usuario ya incluyó el prefijo, no lo duplicamos
    let finalDescription = formData.description;
    if (!finalDescription.startsWith(`${typeLabel} ${typeNumber} -`)) {
      finalDescription = `${typeLabel} ${typeNumber} - ${formData.description}`;
    }
    
    onSave({
      ...formData,
      description: finalDescription,
    });
    onClose();
    
    // Reset form
    setFormData({
      movementNumber: (lastEstimation?.no || 0) + 1,
      type: "estimacion",
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: 0,
      advanceAmortization: 0,
      guaranteeFund: 0,
      paid: 0,
      balanceToPay: 0,
    });
  };

  const getTypeIcon = () => {
    switch (formData.type) {
      case "aditiva":
        return <TrendingUp className="h-6 w-6 text-green-600" />;
      case "deductiva":
        return <TrendingDown className="h-6 w-6 text-red-600" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600" />;
    }
  };

  const getTypeLabel = () => {
    switch (formData.type) {
      case "aditiva":
        return "Aditiva";
      case "deductiva":
        return "Deductiva";
      default:
        return "Estimación";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {getTypeIcon()}
            Nuevo Movimiento del Contrato #{formData.movementNumber}
          </DialogTitle>
          <DialogDescription>
            Registra un nuevo movimiento del contrato (estimación, aditiva o deductiva)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Movimiento</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "estimacion" | "aditiva" | "deductiva") => {
                  setFormData({ ...formData, type: value });
                  // Si cambia a deductiva y el monto es positivo, hacerlo negativo
                  if (value === "deductiva" && formData.amount > 0) {
                    const calculated = calculateValues(-formData.amount, value, 0);
                    setFormData({
                      ...formData,
                      type: value,
                      amount: -formData.amount,
                      ...calculated,
                    });
                  } else if (value !== "deductiva" && formData.amount < 0) {
                    // Si cambia a estimación/aditiva y el monto es negativo, hacerlo positivo
                    const calculated = calculateValues(Math.abs(formData.amount), value, 0);
                    setFormData({
                      ...formData,
                      type: value,
                      amount: Math.abs(formData.amount),
                      ...calculated,
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estimacion">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>Estimación</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="aditiva">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>Aditiva</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="deductiva">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span>Deductiva</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="movementNumber">Número de Movimiento</Label>
              <Input
                id="movementNumber"
                type="number"
                value={formData.movementNumber}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Este número se asigna automáticamente de forma consecutiva
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción
              <span className="text-xs text-muted-foreground ml-2">
                (Solo escribe tu descripción, el prefijo se agrega automáticamente)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Ej: Trabajos preliminares y cimentación"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={2}
            />
            <p className="text-xs text-blue-600">
              ✨ Se guardará como: "{getTypeLabel()} {formData.movementNumber} - {formData.description || '[tu descripción]'}"
            </p>
          </div>

          {/* Monto del movimiento */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Monto del Movimiento
              {formData.type === "deductiva" && (
                <span className="text-red-600 text-xs ml-2">(Ingresa el valor como negativo para deductivas)</span>
              )}
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {formData.type === "estimacion" && (
              <p className="text-xs text-muted-foreground">
                💡 El campo "Pagado" se editará después desde la tabla de movimientos
              </p>
            )}
          </div>

          {/* Cálculos automáticos */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">Cálculos Automáticos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-blue-700 mb-1">Amortización Anticipo ({contractInfo.advancePercentage}%)</p>
                <p className="text-lg font-bold text-blue-900">
                  ${formData.advanceAmortization.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Fondo de Garantía ({contractInfo.guaranteeFundPercentage}%)</p>
                <p className="text-lg font-bold text-blue-900">
                  ${formData.guaranteeFund.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700 mb-1">Saldo a Pagar</p>
                <p className="text-lg font-bold text-blue-900">
                  ${formData.balanceToPay.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resumen del movimiento */}
          <Card 
            className={`border-2 ${
              formData.type === "aditiva" 
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300" 
                : formData.type === "deductiva"
                ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-300"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon()}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tipo de Movimiento</p>
                    <p className="text-xl font-bold">{getTypeLabel()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">Monto Total</p>
                  <p className="text-2xl font-bold">
                    ${formData.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={
                formData.type === "aditiva"
                  ? "bg-green-600 hover:bg-green-700"
                  : formData.type === "deductiva"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {getTypeIcon()}
              <span className="ml-2">Guardar Movimiento</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}