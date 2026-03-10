import { Card, CardContent } from "./ui/card";
import { FileText, Building2, User, Calendar, Percent } from "lucide-react";

interface ContractInfo {
  contractNumber: string;
  contractAmount: number;
  client: string;
  projectName: string;
  startDate: string;
  endDate: string;
  advancePercentage: number;
  guaranteeFundPercentage: number;
}

interface ContractHeaderProps {
  contract: ContractInfo;
}

export function ContractHeader({ contract }: ContractHeaderProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Contract Number */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">No. Contrato</p>
              <p className="text-lg font-bold text-gray-900">{contract.contractNumber}</p>
            </div>
          </div>

          {/* Contract Amount */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Monto del Contrato</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(contract.contractAmount)}</p>
            </div>
          </div>

          {/* Client */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Cliente</p>
              <p className="text-sm font-semibold text-gray-900">{contract.client}</p>
            </div>
          </div>

          {/* Project Name */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Nombre de la Obra</p>
              <p className="text-sm font-semibold text-gray-900">{contract.projectName}</p>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Calendar className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Fecha Inicio / Fin</p>
              <p className="text-sm font-semibold text-gray-900">{contract.startDate} - {contract.endDate}</p>
            </div>
          </div>

          {/* Advance Percentage */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Percent className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">% Anticipo</p>
              <p className="text-lg font-bold text-gray-900">{contract.advancePercentage}%</p>
            </div>
          </div>

          {/* Guarantee Fund Percentage */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Percent className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">% Fondo de Garantía</p>
              <p className="text-lg font-bold text-gray-900">{contract.guaranteeFundPercentage}%</p>
            </div>
          </div>

          {/* Calculated Values */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Anticipo Calculado</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(contract.contractAmount * (contract.advancePercentage / 100))}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
