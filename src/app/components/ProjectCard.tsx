import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  DollarSign
} from "lucide-react";

export interface ProjectData {
  id: string;
  name: string;
  contractNumber: string;
  client: string;
  status: "En proceso" | "Retrasado" | "En tiempo" | "Finalizado";
  progress: number;
  contractAmount: number;
  amountPaid: number;
  startDate: string;
  endDate: string;
  currentEstimation: number;
  totalEstimations: number;
  pendingAmount: number;
}

interface ProjectCardProps {
  project: ProjectData;
  onViewDetails: (projectId: string) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: ProjectData["status"]) => {
    switch (status) {
      case "En proceso":
        return "bg-blue-500";
      case "Retrasado":
        return "bg-red-500";
      case "En tiempo":
        return "bg-green-500";
      case "Finalizado":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeVariant = (status: ProjectData["status"]) => {
    switch (status) {
      case "En proceso":
        return "default";
      case "Retrasado":
        return "destructive";
      case "En tiempo":
        return "default";
      case "Finalizado":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {project.contractNumber}
              </p>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client */}
        <div>
          <p className="text-xs text-muted-foreground">Cliente</p>
          <p className="text-sm font-medium">{project.client}</p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Avance</span>
            <span className="text-sm font-semibold">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getStatusColor(project.status)}`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Monto Contrato</p>
            </div>
            <p className="text-sm font-semibold">
              {formatCurrency(project.contractAmount)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Pagado</p>
            </div>
            <p className="text-sm font-semibold text-green-600">
              {formatCurrency(project.amountPaid)}
            </p>
          </div>
        </div>

        {/* Estimation Info */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Estimación {project.currentEstimation} de {project.totalEstimations}
            </span>
          </div>
          {project.pendingAmount > 0 && (
            <div className="flex items-center gap-1 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">
                {formatCurrency(project.pendingAmount)} pendiente
              </span>
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">Inicio</p>
            <p className="font-medium">{project.startDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fin</p>
            <p className="font-medium">{project.endDate}</p>
          </div>
        </div>

        {/* View Details Button */}
        <Button
          className="w-full mt-4 gap-2"
          onClick={() => onViewDetails(project.id)}
        >
          Ver Detalles
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
