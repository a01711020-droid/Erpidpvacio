/**
 * DASHBOARD EMPRESARIAL GLOBAL
 * 
 * Componente PURO - Solo visual
 * No contiene lógica de negocio ni fetch
 * Recibe data por props
 * 
 * TRES ESTADOS VISUALES:
 * 1. Loading - Skeleton mientras carga
 * 2. Empty - Sin obras registradas
 * 3. WithData - Muestra tarjetas de obras con métricas
 */

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { Badge } from "./ui/badge";

// ============================================================================
// TIPOS - Basados en los schemas JSON
// ============================================================================

interface MetricasObra {
  obra_id: string;
  codigo_obra: string;
  nombre_obra: string;
  cliente: string;
  residente: string;
  estado: "activa" | "suspendida" | "terminada" | "cancelada";
  monto_contratado: number;
  monto_comprometido: number;
  monto_pagado: number;
  saldo_disponible: number;
  porcentaje_ejercido: number;
  avance_fisico_porcentaje: number;
  estado_financiero: "saludable" | "advertencia" | "critico";
  total_estimaciones: number;
  dias_transcurridos: number;
  dias_restantes: number;
  porcentaje_tiempo_transcurrido: number;
}

// ============================================================================
// PROPS DEL COMPONENTE
// ============================================================================

interface DashboardEmpresarialProps {
  // Estado de carga
  isLoading?: boolean;
  
  // Data
  obras?: MetricasObra[];
  
  // Callbacks
  onSelectObra?: (obraId: string) => void;
  onCrearObra?: () => void;
}

// ============================================================================
// ESTADO 1: LOADING
// ============================================================================

function LoadingState() {
  return (
    <div className="space-y-6">
      {/* KPIs Globales Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Obras Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
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

function EmptyState({ onCrearObra }: { onCrearObra?: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mx-auto w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mb-6">
            <Building2 className="h-10 w-10 text-warm-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            No hay obras registradas
          </h2>
          
          <p className="text-gray-600 mb-6">
            Comienza creando tu primera obra para visualizar métricas financieras 
            y dar seguimiento al avance de tus proyectos.
          </p>
          
          <Button 
            onClick={onCrearObra}
            size="lg"
            className="gap-2"
          >
            <Plus className="h-5 w-5" />
            Crear Primera Obra
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            O importa obras existentes desde tu sistema anterior
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// ESTADO 3: WITH DATA - Componentes auxiliares
// ============================================================================

function EstadoFinancieroIcon({ estado }: { estado: string }) {
  switch (estado) {
    case "saludable":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "advertencia":
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "critico":
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />;
  }
}

function EstadoFinancieroBadge({ estado }: { estado: string }) {
  const colors = {
    saludable: "bg-green-100 text-green-800",
    advertencia: "bg-yellow-100 text-yellow-800",
    critico: "bg-red-100 text-red-800"
  };
  
  const labels = {
    saludable: "Saludable",
    advertencia: "Advertencia",
    critico: "Crítico"
  };
  
  return (
    <Badge className={colors[estado as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
      {labels[estado as keyof typeof labels] || estado}
    </Badge>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(amount);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

// ============================================================================
// ESTADO 3: WITH DATA - Tarjeta de Obra
// ============================================================================

function ObraCard({ 
  obra, 
  onSelect 
}: { 
  obra: MetricasObra; 
  onSelect?: (id: string) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-warm-400">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-warm-700 bg-warm-100 px-2 py-1 rounded">
                {obra.codigo_obra}
              </span>
              <EstadoFinancieroBadge estado={obra.estado_financiero} />
            </div>
            <CardTitle className="text-xl mb-1">{obra.nombre_obra}</CardTitle>
            <p className="text-sm text-gray-600">{obra.cliente}</p>
          </div>
          <EstadoFinancieroIcon estado={obra.estado_financiero} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Métricas Principales */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Contratado</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(obra.monto_contratado)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Comprometido</p>
            <p className="text-lg font-bold text-blue-600">
              {formatCurrency(obra.monto_comprometido)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Pagado</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(obra.monto_pagado)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Saldo</p>
            <p className="text-lg font-bold text-warm-600">
              {formatCurrency(obra.saldo_disponible)}
            </p>
          </div>
        </div>

        {/* Barra de Progreso Financiero */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Ejercido</span>
            <span className="text-xs font-bold text-gray-900">
              {formatPercentage(obra.porcentaje_ejercido)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                obra.estado_financiero === 'saludable' ? 'bg-green-500' :
                obra.estado_financiero === 'advertencia' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(obra.porcentaje_ejercido, 100)}%` }}
            />
          </div>
        </div>

        {/* Info Adicional */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            <span>Avance: {formatPercentage(obra.avance_fisico_porcentaje)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{obra.dias_transcurridos}d / {obra.dias_restantes}d rest.</span>
          </div>
        </div>

        {/* Botón de Acción */}
        <Button 
          onClick={() => onSelect?.(obra.obra_id)}
          variant="outline"
          className="w-full gap-2 hover:bg-warm-50 hover:border-warm-400"
        >
          Ver Dashboard de Obra
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ESTADO 3: WITH DATA - KPIs Globales
// ============================================================================

function KPIsGlobales({ obras }: { obras: MetricasObra[] }) {
  // Mock calculations - En realidad vendrían calculados del backend
  const totalContratado = obras.reduce((sum, o) => sum + o.monto_contratado, 0);
  const totalComprometido = obras.reduce((sum, o) => sum + o.monto_comprometido, 0);
  const totalPagado = obras.reduce((sum, o) => sum + o.monto_pagado, 0);
  const totalSaldo = obras.reduce((sum, o) => sum + o.saldo_disponible, 0);
  
  const kpis = [
    {
      label: "Total Contratado",
      value: formatCurrency(totalContratado),
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Total Comprometido",
      value: formatCurrency(totalComprometido),
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      label: "Total Pagado",
      value: formatCurrency(totalPagado),
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Saldo Disponible",
      value: formatCurrency(totalSaldo),
      icon: TrendingUp,
      color: "text-warm-600",
      bgColor: "bg-warm-50"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function DashboardEmpresarial({
  isLoading = false,
  obras = [],
  onSelectObra,
  onCrearObra
}: DashboardEmpresarialProps) {
  
  // Estado 1: Loading
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Estado 2: Empty
  if (!obras || obras.length === 0) {
    return <EmptyState onCrearObra={onCrearObra} />;
  }
  
  // Estado 3: With Data
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Empresarial</h1>
          <p className="text-gray-600 mt-1">
            Vista global de {obras.length} {obras.length === 1 ? 'obra activa' : 'obras activas'}
          </p>
        </div>
        <Button onClick={onCrearObra} className="gap-2">
          <Plus className="h-5 w-5" />
          Nueva Obra
        </Button>
      </div>

      {/* KPIs Globales */}
      <KPIsGlobales obras={obras} />
      
      {/* Grid de Obras */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Obras Activas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {obras.map((obra) => (
            <ObraCard 
              key={obra.obra_id} 
              obra={obra} 
              onSelect={onSelectObra}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
