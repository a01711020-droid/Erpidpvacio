/**
 * STATE PANEL
 * 
 * Componente universal para manejar estados: loading, empty, error, data
 * Reemplaza código repetitivo en toda la aplicación
 */

import React from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type ViewState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface StatePanelProps {
  state: ViewState;
  error?: string | null;
  isEmpty?: boolean;
  children: React.ReactNode;
  
  // Loading state
  loadingMessage?: string;
  loadingSkeleton?: React.ReactNode;
  
  // Empty state
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  
  // Error state
  errorTitle?: string;
  onRetry?: () => void;
  retryLabel?: string;
  
  // Layout
  className?: string;
  containerClassName?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function StatePanel({
  state,
  error,
  isEmpty = false,
  children,
  loadingMessage = 'Cargando...',
  loadingSkeleton,
  emptyIcon,
  emptyTitle = 'No hay datos',
  emptyMessage = 'No se encontraron registros.',
  emptyAction,
  errorTitle = 'Error al cargar datos',
  onRetry,
  retryLabel = 'Reintentar',
  className = '',
  containerClassName = '',
}: StatePanelProps) {
  
  // Loading State
  if (state === 'loading') {
    if (loadingSkeleton) {
      return <div className={containerClassName}>{loadingSkeleton}</div>;
    }
    
    return (
      <Card className={`p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">{loadingMessage}</p>
        </div>
      </Card>
    );
  }
  
  // Error State
  if (state === 'error') {
    return (
      <Card className={`p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{errorTitle}</h3>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md">
                <p className="text-sm text-red-800 font-mono">{error}</p>
              </div>
            )}
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="mt-4">
              {retryLabel}
            </Button>
          )}
        </div>
      </Card>
    );
  }
  
  // Empty State
  if (state === 'success' && isEmpty) {
    return (
      <Card className={`p-12 ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-gray-100 p-4">
            {emptyIcon || <Inbox className="h-12 w-12 text-gray-400" />}
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{emptyTitle}</h3>
            <p className="text-sm text-gray-600 max-w-md">{emptyMessage}</p>
          </div>
          {emptyAction && (
            <Button onClick={emptyAction.onClick} className="mt-4">
              {emptyAction.label}
            </Button>
          )}
        </div>
      </Card>
    );
  }
  
  // Success State with Data
  return <div className={containerClassName}>{children}</div>;
}

// ============================================================================
// SKELETON COMPONENTS
// ============================================================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-16 flex-1" />
          <Skeleton className="h-16 flex-1" />
          <Skeleton className="h-16 flex-1" />
          <Skeleton className="h-16 w-24" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </Card>
  );
}

export function GridSkeleton({ cols = 3, items = 6 }: { cols?: number; items?: number }) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[cols] || 'grid-cols-3';
  
  return (
    <div className={`grid ${gridClass} gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ============================================================================
// EJEMPLO DE USO
// ============================================================================

/*
import { StatePanel, TableSkeleton } from '@/core/ui/StatePanel';
import { dataAdapter } from '@/core/data';

function MyComponent() {
  const [state, setState] = useState<ViewState>('loading');
  const [data, setData] = useState<Obra[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setState('loading');
    const result = await dataAdapter.listObras();
    
    if (result.status === 'error') {
      setError(result.error);
      setState('error');
    } else {
      setData(result.data);
      setState(result.data.length === 0 ? 'empty' : 'success');
    }
  }

  return (
    <StatePanel
      state={state}
      error={error}
      isEmpty={data.length === 0}
      loadingSkeleton={<TableSkeleton rows={10} />}
      emptyTitle="No hay obras registradas"
      emptyMessage="Comienza creando tu primera obra."
      emptyAction={{
        label: "Crear Obra",
        onClick: () => console.log("crear")
      }}
      onRetry={loadData}
    >
      <table>
        {data.map(obra => <tr key={obra.obra_id}>...</tr>)}
      </table>
    </StatePanel>
  );
}
*/
